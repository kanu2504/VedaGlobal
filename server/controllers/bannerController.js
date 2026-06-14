import Banner from '../models/Banner.js';

// Get active banners
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all banners (Admin)
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create banner
export const createBanner = async (req, res) => {
  const { desktopImage, mobileImage, title, subtitle, linkButton, active } = req.body;
  try {
    const banner = new Banner({ desktopImage, mobileImage, title, subtitle, linkButton, active });
    const created = await banner.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  const { desktopImage, mobileImage, title, subtitle, linkButton, active } = req.body;
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      banner.desktopImage = desktopImage || banner.desktopImage;
      banner.mobileImage = mobileImage || banner.mobileImage;
      banner.title = title !== undefined ? title : banner.title;
      banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
      banner.linkButton = linkButton !== undefined ? linkButton : banner.linkButton;
      banner.active = active !== undefined ? active : banner.active;
      const updated = await banner.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await Banner.deleteOne({ _id: req.params.id });
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
