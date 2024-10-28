import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5000;

// MongoDB URI 설정 (비밀번호를 포함한 URI로 교체하세요)
const mongoURI =
  "mongodb+srv://admin:<password>@cluster0.mongodb.net/visitor_counter?retryWrites=true&w=majority";

// MongoDB 연결
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Express 미들웨어 설정
app.use(cors());
app.use(express.json());

// 방문자 스키마 정의 및 모델 생성
const visitorSchema = new mongoose.Schema({
  date: { type: String, required: true },
  totalVisitors: { type: Number, default: 0 },
  todayVisitors: { type: Number, default: 0 },
});

const Visitor = mongoose.model("Visitor", visitorSchema);

// 오늘 날짜를 가져오는 함수
const getToday = () => new Date().toISOString().slice(0, 10);

// 방문자 수 증가 API
app.post("/api/increment", async (req, res) => {
  const today = getToday();
  let visitorData = await Visitor.findOne({ date: today });

  if (!visitorData) {
    visitorData = new Visitor({
      date: today,
      totalVisitors: 1,
      todayVisitors: 1,
    });
  } else {
    visitorData.totalVisitors += 1;
    visitorData.todayVisitors += 1;
  }

  await visitorData.save();
  res.json(visitorData);
});

// 방문자 수 조회 API
app.get("/api/visitors", async (req, res) => {
  const today = getToday();
  const visitorData = (await Visitor.findOne({ date: today })) || {
    totalVisitors: 0,
    todayVisitors: 0,
  };
  res.json(visitorData);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});