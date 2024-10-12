const express = require('express');
const multer = require('multer');
const Member = require('../models/member');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // ที่เก็บไฟล์ภาพ

// ฟังก์ชันคำนวณอายุ
const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};

// เพิ่มสมาชิก
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const { title, firstName, lastName, birthDate } = req.body;
    const age = calculateAge(birthDate);
    const profileImage = req.file.path; // path ของภาพที่อัปโหลด

    const newMember = new Member({ title, firstName, lastName, birthDate, age, profileImage });
    await newMember.save();

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// แก้ไขสมาชิก
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { title, firstName, lastName, birthDate } = req.body;
    const age = calculateAge(birthDate);
    const profileImage = req.file ? req.file.path : undefined; // ใช้ path ของภาพใหม่ถ้ามี

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { title, firstName, lastName, birthDate, age, profileImage, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ลบสมาชิก
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// แสดงสมาชิกทั้งหมด
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
