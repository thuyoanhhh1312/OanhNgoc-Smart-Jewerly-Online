import db from '../models/index.js';

export const getBankAccounts = async (req, res) => {
    try {
        const all = req.query.all === 'true';
        let whereClause = {};

        if (!all) {
            whereClause = { is_enabled: true };
        }

        const accounts = await db.BankAccount.findAll({ where: whereClause });
        res.json(accounts);
    } catch (error) {
        console.error('Error getBankAccounts:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản ngân hàng.' });
    }
};

export const createBankAccount = async (req, res) => {
    try {
        const data = req.body;
        const newAccount = await db.BankAccount.create(data);
        res.status(201).json(newAccount);
    } catch (error) {
        console.error('Error createBankAccount:', error);
        res.status(400).json({ message: error.message || 'Lỗi khi tạo tài khoản.' });
    }
};

export const updateBankAccount = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await db.BankAccount.findByPk(id);
        if (!account) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
        }
        await account.update(req.body);
        res.json(account);
    } catch (error) {
        console.error('Error updateBankAccount:', error);
        res.status(400).json({ message: error.message || 'Lỗi khi cập nhật tài khoản.' });
    }
};

export const deleteBankAccount = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await db.BankAccount.findByPk(id);
        if (!account) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
        }
        await account.destroy();
        res.json({ message: 'Xóa tài khoản thành công.' });
    } catch (error) {
        console.error('Error deleteBankAccount:', error);
        res.status(400).json({ message: error.message || 'Lỗi khi xóa tài khoản.' });
    }
};

export const toggleBankAccountStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { is_enabled } = req.body; // nhận giá trị boolean từ client

        if (typeof is_enabled !== 'boolean') {
            return res.status(400).json({ message: 'Trường is_enabled phải là boolean.' });
        }

        const account = await db.BankAccount.findByPk(id);
        if (!account) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
        }

        account.is_enabled = is_enabled;
        await account.save();

        res.json({ message: `Tài khoản đã được ${is_enabled ? 'bật' : 'tắt'}.`, account });
    } catch (error) {
        console.error('Error toggleBankAccountStatus:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái tài khoản.' });
    }
};
