import axios from 'axios';
import { load } from 'cheerio'; // Sửa import cheerio
import slugify from 'slugify';
import pLimit from 'p-limit';
import Product from './models/Product.js';
import ProductImage from './models/ProductImage.js';

const BASE_URL = 'https://www.pnj.com.vn';
const limit = pLimit(3); // Giới hạn số request đồng thời

// Danh sách subcategory - cần cập nhật đúng urlSlug tương ứng trang PNJ thực tế
const subCategories = [
    { subcategory_id: 1, subcategory_name: 'Bông tai bạc', category_id: 1, urlSlug: 'bong-tai' },
    { subcategory_id: 2, subcategory_name: 'Mặt dây chuyền bạc', category_id: 2, urlSlug: 'mat-day-chuyen' },
    { subcategory_id: 3, subcategory_name: 'Lắc bạc', category_id: 3, urlSlug: 'lac' },
    { subcategory_id: 4, subcategory_name: 'Vòng tay bạc', category_id: 3, urlSlug: 'vong' },
    { subcategory_id: 6, subcategory_name: 'Dây chuyền bạc', category_id: 4, urlSlug: 'day-chuyen' },
    { subcategory_id: 7, subcategory_name: 'Nhẫn bạc', category_id: 5, urlSlug: 'nhan' },
    { subcategory_id: 8, subcategory_name: 'Charm bạc', category_id: 6, urlSlug: 'charm' },
    { subcategory_id: 9, subcategory_name: 'Dây cổ bạc', category_id: 7, urlSlug: 'day-co' },
];

// Hàm fetch với retry tối đa 3 lần, delay 1s
async function fetchWithRetry(url, retries = 3, delayMs = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            return res.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retry ${i + 1} for URL: ${url}`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}

// Lấy danh sách sản phẩm theo subcategory & trang
async function scrapeProductsBySubCategory(subCat, page = 1) {
    const url = `${BASE_URL}/${subCat.urlSlug}?page=${page}`;
    console.log(`Lấy sản phẩm subcategory ${subCat.subcategory_name}, trang ${page}: ${url}`);

    const html = await fetchWithRetry(url);
    const $ = load(html);

    const products = [];

    $('.product-item').each((i, el) => {
        const name = $(el).find('.product-item__name').text().trim();
        const priceText = $(el).find('.product-item__price').text().trim();
        const price = parseFloat(priceText.replace(/[^0-9]/g, '')) || 0;

        const linkPartial = $(el).find('a').attr('href');
        if (!linkPartial) return;

        const link = BASE_URL + linkPartial;

        products.push({
            name,
            price,
            link,
            category_id: subCat.category_id,
            subcategory_id: subCat.subcategory_id,
        });
    });

    // Kiểm tra tồn tại nút "Trang tiếp theo" trong phân trang
    // Có thể thay selector này nếu PNJ thay đổi
    const hasNextPage = $('.pagination__page--next').length > 0;

    return { products, hasNextPage };
}

// Lấy chi tiết sản phẩm
async function scrapeProductDetail(product) {
    const html = await fetchWithRetry(product.link);
    const $ = load(html);

    // Mô tả sản phẩm (tab mô tả)
    const description = $('#tab-description').text().trim() || null;

    // Tạo slug chuẩn
    const slug = slugify(product.name, { lower: true, strict: true });

    // Lấy danh sách ảnh
    const images = [];
    $('.product-gallery__list img').each((i, el) => {
        let imgUrl = $(el).attr('data-src') || $(el).attr('src') || '';
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

        const altText = $(el).attr('alt') || product.name;

        images.push({
            image_url: imgUrl,
            alt_text: altText,
            is_main: i === 0,
        });
    });

    return {
        product_name: product.name,
        price: product.price,
        slug,
        description,
        images,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
    };
}

// Lưu sản phẩm và ảnh vào DB
async function saveProductToDb(productData) {
    const exists = await Product.count({ where: { slug: productData.slug } });
    if (exists) {
        console.log(`Sản phẩm đã tồn tại: ${productData.product_name}`);
        return;
    }

    const product = await Product.create({
        product_name: productData.product_name,
        price: productData.price,
        slug: productData.slug,
        description: productData.description,
        quantity: 0,
        sold_quantity: 0,
        is_active: true,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id,
        created_at: new Date(),
        updated_at: new Date(),
    });

    for (let i = 0; i < productData.images.length; i++) {
        const img = productData.images[i];
        await ProductImage.create({
            product_id: product.product_id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            is_main: i === 0,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    console.log(`Đã lưu sản phẩm: ${productData.product_name}`);
}

// Hàm chính chạy scraper tuần tự qua các subcategory và phân trang
async function runScraper() {
    for (const subCat of subCategories) {
        let page = 1;
        let hasNext = true;

        while (hasNext) {
            try {
                const { products, hasNextPage } = await scrapeProductsBySubCategory(subCat, page);

                const promises = products.map(product =>
                    limit(async () => {
                        const productData = await scrapeProductDetail(product);
                        await saveProductToDb(productData);
                    })
                );

                await Promise.all(promises);

                hasNext = hasNextPage;
                page++;

                // Delay để tránh spam request
                await new Promise(r => setTimeout(r, 1500));
            } catch (error) {
                console.error(`Lỗi cào ${subCat.subcategory_name} trang ${page}:`, error.message);
                hasNext = false;
            }
        }
    }
    console.log('Hoàn thành cào dữ liệu.');
}

export default runScraper;