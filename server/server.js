const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB Atlas'))
  .catch(err => console.error(' MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: String
});

const assetSchema = new mongoose.Schema({
  assetNumber: String,
  equipmentType: String,
  boqItem: String,
  location: String,
  department: String,
  ipAddress: String
});

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  description: String,
  category: String,
  date: { type: Date, default: Date.now },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closedAt: Date,
  status: { type: String, default: 'Open' }, // Open, Running, Closed
  feedback: String
});
app.put('/complaints/close/:id', async (req, res) => {
  const { closedBy } = req.body;
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Closed',
        closedBy,
        closedAt: new Date()
      },
      { new: true }
    ).populate('userId assetId');

    if (!updated) {
      return res.status(404).send({ msg: 'Complaint not found' });
    }

    res.send({ msg: 'Complaint closed', complaint: updated });
  } catch (err) {
    console.error(' Error closing complaint:', err);
    res.status(500).send({ msg: 'Failed to close complaint', error: err });
  }
});

// Utility function
function generateComplaintId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

app.post('/complaints', async (req, res) => {
  const { userId, assetId, description, category } = req.body;
  const complaintId = generateComplaintId(); // ⬅ Generate ID

  try {
    const newComplaint = new Complaint({
      complaintId,
      userId,
      assetId,
      description,
      category
    });
    await newComplaint.save();
    res.send({ msg: 'Complaint submitted successfully', complaintId }); // ⬅ Send it back
  } catch (err) {
    res.status(500).send({ msg: 'Failed to submit complaint', error: err });
  }
});

app.get('/complaints/:complaintId', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId })
      .populate('userId')
      .populate('assetId');

    if (!complaint) {
      return res.status(404).send({ msg: 'Complaint not found' });
    }

    res.send(complaint);
  } catch (err) {
    res.status(500).send({ msg: 'Error fetching complaint', error: err });
  }
});


const pmSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pmDate: { type: Date, default: Date.now },
  checklist: {
    voltage: Boolean,
    osCheck: Boolean,
    antivirus: Boolean,
    printerClean: Boolean,
    testPrint: Boolean,
    junkFiles: Boolean,
    monitorCheck: Boolean,
    contractStartDate: Date,
    contractEndDate: Date

  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approved: { type: Boolean, default: false },
  billingReady: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
completedAt: { type: Date }

});

const User = mongoose.model('User', userSchema);
const Asset = mongoose.model('Asset', assetSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const PreventiveMaintenance = mongoose.model('PreventiveMaintenance', pmSchema);


app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send({ msg: 'User already exists' });

    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.send({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).send({ msg: 'Registration failed', error: err });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.send({ msg: 'Login successful', user });
    } else {
      res.status(401).send({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).send({ msg: 'Login failed', error: err });
  }
});

app.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.send(assets);
  } catch (err) {
    res.status(500).send({ msg: 'Failed to fetch assets', error: err });
  }
});

app.post('/complaints', async (req, res) => {
  const { userId, assetId, description, category } = req.body;
  try {
    const complaint = new Complaint({ userId, assetId, description, category });
    await complaint.save();
    res.send({ msg: 'Complaint submitted successfully' });
  } catch (err) {
    res.status(500).send({ msg: 'Failed to submit complaint', error: err });
  }
});

app.post('/pm', async (req, res) => {
  const { assetId, engineerId, checklist } = req.body;
  try {
    const pm = new PreventiveMaintenance({ assetId, engineerId, checklist });
    await pm.save();
    res.send({ msg: 'PM submitted successfully' });
  } catch (err) {
    res.status(500).send({ msg: 'Failed to submit PM', error: err });
  }
});

app.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('assetId')
      .populate('userId');
    res.send(complaints);
  } catch (err) {
    res.status(500).send({ msg: 'Error fetching complaints', error: err });
  }
});

app.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('assetId')
      .populate('userId');

    console.log('Fetched complaints:', complaints); // 🔍 log to see if they exist
    res.send(complaints);
  } catch (err) {
    res.status(500).send({ msg: 'Error fetching complaints', error: err });
  }
});

app.get('/pm', async (req, res) => {
  try {
    const pmReports = await PreventiveMaintenance.find()
      .populate('assetId')
      .populate('engineerId');
    res.send(pmReports);
  } catch (err) {
    res.status(500).send({ msg: 'Error fetching PMs', error: err });
  }
});

app.put('/pm/verify/:id', async (req, res) => {
  try {
    const { verifiedBy } = req.body;
    const pm = await PreventiveMaintenance.findByIdAndUpdate(
      req.params.id,
      { verifiedBy },
      { new: true }
    );
    res.send({ msg: 'PM Verified', pm });
  } catch (err) {
    res.status(500).send({ msg: 'Verification failed', error: err });
  }
});

app.put('/pm/approve/:id', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const pm = await PreventiveMaintenance.findByIdAndUpdate(
      req.params.id,
      { approvedBy, approved: true },
      { new: true }
    );
    res.send({ msg: 'PM Approved', pm });
  } catch (err) {
    res.status(500).send({ msg: 'Approval failed', error: err });
  }
});

app.put('/pm/billing/:id', async (req, res) => {
  try {
    const pm = await PreventiveMaintenance.findByIdAndUpdate(
      req.params.id,
      { billingReady: true },
      { new: true }
    );
    res.send({ msg: 'PM marked for billing', pm });
  } catch (err) {
    res.status(500).send({ msg: 'Billing mark failed', error: err });
  }
});

app.get('/pm/billing', async (req, res) => {
  try {
    const reports = await PreventiveMaintenance.find({ billingReady: true })
      .populate('assetId')
      .populate('engineerId');
    res.send(reports);
  } catch (err) {
    res.status(500).send({ msg: 'Failed to load billing reports', error: err });
  }
});
app.put('/pm/complete/:id', async (req, res) => {
  const { completedBy } = req.body;
  const now = new Date();
  const end = new Date(now);
  end.setFullYear(end.getFullYear() + 2);

  try {
    const updated = await PreventiveMaintenance.findByIdAndUpdate(
      req.params.id,
      {
        completed: true,
        completedBy,
        completedAt: now,
        contractStartDate: now,
        contractEndDate: end
      },
      { new: true }
    ).populate('assetId engineerId');

    res.send({ msg: 'PM marked as completed', pm: updated });
  } catch (err) {
    res.status(500).send({ msg: 'Failed to mark as completed', error: err });
  }
});


app.listen(3000, () => {
  console.log(' Server running on http://localhost:3000');
});
