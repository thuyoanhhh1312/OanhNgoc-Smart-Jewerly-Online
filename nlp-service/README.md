## **Tóm tắt quy trình chạy**

1. **Mở terminal**, cd vào `nlp-service`
2. `python -m venv venv` // tạo môi trường ảo Python
3. `venv\Scripts\activate` // kích hoạt môi trường ảo
4. `pip install -r requirements.txt`
5. `uvicorn sentiment_api:app --reload --host 0.0.0.0 --port 5001` //Chạy API server với Uvicorn

## ** cURL sample: import vào postman để test**

## \*\* case trung tính

curl --location 'http://localhost:5001/sentiment' \--header 'Content-Type: application/json' \--data '{ "text": "Chất lượng bình thường."}'

## \*\* case Tiêu cực

curl --location 'http://localhost:5001/sentiment' \
--header 'Content-Type: application/json' \
--data '{
"text": "Tôi rất thất vọng về sản phẩm này."
}'

## ** case Tích cực

curl --location 'http://localhost:5001/sentiment' \
--header 'Content-Type: application/json' \
--data '{ "text": "Sản phẩm tuyệt vời, tôi rất hài lòng!" }'
