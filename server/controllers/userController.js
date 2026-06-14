import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';

// --- CUSTOMERS ---
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  const { name, email, password, phone, address, pincode } = req.body;
  try {
    const exists = await Customer.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const customer = new Customer({ name, email, password, phone, address, pincode });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (customer && customer.password === password) {
      if (customer.isBlocked) {
        return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
      }
      res.json(customer);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      await Customer.deleteOne({ _id: req.params.id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { name, email, phone, address, pincode } = req.body;
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      if (email && email.toLowerCase() !== customer.email.toLowerCase()) {
        const exists = await Customer.findOne({ email });
        if (exists) {
          return res.status(400).json({ message: 'Email already in use by another customer' });
        }
        customer.email = email;
      }
      customer.name = name || customer.name;
      customer.phone = phone !== undefined ? phone : customer.phone;
      customer.address = address !== undefined ? address : customer.address;
      customer.pincode = pincode !== undefined ? pincode : customer.pincode;
      const updated = await customer.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleBlockCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.isBlocked = !customer.isBlocked;
      await customer.save();
      res.json({ message: `Customer ${customer.isBlocked ? 'blocked' : 'unblocked'} successfully`, customer });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADMINS ---
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  const { email, password, name, phone, role } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = new Admin({ email, password, name, phone, role });
    await admin.save();
    res.status(201).json({ _id: admin._id, email: admin.email, name: admin.name, role: admin.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  const { name, email, phone, avatar } = req.body;
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      if (email && email.toLowerCase() !== admin.email.toLowerCase()) {
        const exists = await Admin.findOne({ email });
        if (exists) {
          return res.status(400).json({ message: 'Email already in use by another admin' });
        }
        admin.email = email;
      }
      admin.name = name !== undefined ? name : admin.name;
      admin.phone = phone !== undefined ? phone : admin.phone;
      admin.avatar = avatar !== undefined ? avatar : admin.avatar;
      const updated = await admin.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      if (admin.email === 'admin@vedaglobal.com') {
        return res.status(400).json({ message: 'Cannot delete default primary admin' });
      }
      await Admin.deleteOne({ _id: req.params.id });
      res.json({ message: 'Admin removed successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeAdminRole = async (req, res) => {
  const { role } = req.body;
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      if (admin.email === 'admin@vedaglobal.com') {
        return res.status(400).json({ message: 'Cannot change default primary admin role' });
      }
      admin.role = role;
      await admin.save();
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetAdminPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      admin.password = password;
      await admin.save();
      res.json({ message: 'Password reset successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
