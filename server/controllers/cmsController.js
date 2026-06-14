import CMS from '../models/CMS.js';

// @desc    Get CMS content by key
// @route   GET /api/cms/:key
// @access  Public
export const getCMSContent = async (req, res) => {
  try {
    const cms = await CMS.findOne({ key: req.params.key });
    if (!cms) {
      return res.status(404).json({ message: `CMS key '${req.params.key}' not found` });
    }
    res.json(cms.value);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all CMS keys and contents
// @route   GET /api/cms
// @access  Public
export const getAllCMSContent = async (req, res) => {
  try {
    const cmsList = await CMS.find();
    const result = {};
    cmsList.forEach(item => {
      result[item.key] = item.value;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update CMS content
// @route   PUT /api/cms/:key
// @access  Private (Admin)
export const updateCMSContent = async (req, res) => {
  const { value } = req.body;

  try {
    let cms = await CMS.findOne({ key: req.params.key });

    if (cms) {
      cms.value = value;
      await cms.save();
    } else {
      cms = new CMS({
        key: req.params.key,
        value
      });
      await cms.save();
    }

    res.json({ message: `CMS key '${req.params.key}' updated successfully`, data: cms.value });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
