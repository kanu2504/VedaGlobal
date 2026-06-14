import Setting from '../models/Setting.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    const settingsList = await Setting.find();
    const result = {};
    settingsList.forEach(item => {
      result[item.key] = item.value;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update setting
// @route   PUT /api/settings/:key
// @access  Private (Admin)
export const updateSetting = async (req, res) => {
  const { value } = req.body;

  try {
    let setting = await Setting.findOne({ key: req.params.key });

    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = new Setting({
        key: req.params.key,
        value
      });
      await setting.save();
    }

    res.json({ message: `Setting '${req.params.key}' updated successfully`, data: setting.value });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update website mode setting
// @route   PUT /api/settings/mode
// @access  Private (Admin)
export const updateSettingMode = async (req, res) => {
  const mode = req.body.mode || req.body.value;

  if (!mode || (mode !== 'B2C' && mode !== 'B2B')) {
    return res.status(400).json({ message: 'Invalid mode. Must be B2C or B2B' });
  }

  try {
    // We update both keys: default_mode and mode to ensure absolute compatibility
    let settingDefault = await Setting.findOne({ key: 'default_mode' });
    if (settingDefault) {
      settingDefault.value = mode;
      await settingDefault.save();
    } else {
      settingDefault = new Setting({ key: 'default_mode', value: mode });
      await settingDefault.save();
    }

    let settingMode = await Setting.findOne({ key: 'mode' });
    if (settingMode) {
      settingMode.value = mode;
      await settingMode.save();
    } else {
      settingMode = new Setting({ key: 'mode', value: mode });
      await settingMode.save();
    }

    res.json({ message: `Website mode updated to ${mode}`, mode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get blog visibility setting
// @route   GET /api/settings/blog-visibility
// @access  Public
export const getBlogVisibility = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'blogEnabled' });
    const blogEnabled = setting ? setting.value === true : true; // default to true
    res.json({ blogEnabled });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog visibility setting
// @route   PUT /api/settings/blog-visibility
// @access  Private (Admin)
export const updateBlogVisibility = async (req, res) => {
  const { blogEnabled } = req.body;
  if (blogEnabled === undefined || typeof blogEnabled !== 'boolean') {
    return res.status(400).json({ message: 'blogEnabled must be a boolean' });
  }

  try {
    let setting = await Setting.findOne({ key: 'blogEnabled' });
    if (setting) {
      setting.value = blogEnabled;
      await setting.save();
    } else {
      setting = new Setting({ key: 'blogEnabled', value: blogEnabled });
      await setting.save();
    }
    res.json({ message: `Blog page visibility set to ${blogEnabled}`, blogEnabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
