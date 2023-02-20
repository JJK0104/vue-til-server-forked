// localhost:3000
// localhost:3000/api/docs

// libs
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import detectPort from 'detect-port';
import chalk from 'chalk';

// api
import auth from './api/auth.js';
import posts from './api/posts.js';
import docs from './utils/api-doc.js';

// utils
import { authenticateUser } from './utils/auth.js';

// mongo db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// MongoDB를 node.js에 연결하는 코드
mongoose.connect(
  // DB를 생성해서 'url'로 연겨해주기
  // 구글에서 MongoDB Cloud 검색해서 사이트 들어가기 -> MongoDB Cloud 지금 체험하기 클릭 -> 회원가입 ->
  // 무료 시작하기 -> 로그인 -> New Project 버튼 클릭 -> My Project로 이름 짓기 -> Create Project 클릭 ->
  // Database Deployments 화면 뜬다 -> Build a Database 클릭 -> 무료인 Shared 클릭 ->기본 내용으로 create cluster 클릭
  // -> Security QuickStart -> Username and Password 선택 -> 데이터베이스를 접근할 수 있는 계정을 생성하는 거
  // -> username : test , Password : 1234 -> Add my Current IP Address 클릭 -> Finish and Close 클릭
  // -> Go to Database 클릭
  // Security -> Network Access -> Add IP Address -> Allow Access from anywhere 으로 어디서든 접근 가능하게 하기
  // Deployment -> Database -> 아까 만든 Cluster 의 Connect 버튼 클릭 -> Connect your application 클릭
  // -> Add your connecitno string into your application code에 있는 거 복사
  // <password>는 아까 만든 1234로
  // 이러면 이제 이 api 서버가 MongoDB Cloud에 있는 데이터베이스를 연결해서 전반적인 데이터를 저장하고,읽고,수정할 수 있다.
  // 이제 저장하고 npm run dev 하면
  // (node:13239) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated,
  // and will be removed in a future version.
  // To use the new Server Discover and Monitoring engine,
  // pass option { useUnifiedTopology: true } to the MongoClient constructor.
  // 이런 게 뜨는데 { useUnifiedTopology: true } 이걸 키:value 형태로 아래에 넣어주면된다
  // 이제 api 서버와 몽고DB가 잘 연결됐는지 api문서를 통해 확인
  // localhost:3000/api/docs 로 가서 /signup 클릭하고 try it out 클릭 -> parameters 입력하고 execute 클릭
  // 서버에 직접 요청 보내는 것과 동일
  // swagger의 장점 : 서버가 실행된 상태에서 api문서가 올라오기 때문에 서버에 직접적인 데이터를 보내보고 응답까지 확인가능
  'mongodb+srv://test:1234@cluster0.htc9kiq.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
mongoose.Promise = global.Promise;

// server setup
let port;
async function configServer() {
  port = 3000 || (await detectPort(3000));
}
configServer();

// express setup
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log request

// express routers
app.use('/', auth);
app.use('/posts', authenticateUser, posts);

// api docs
app.use('/api', docs);

// start
app.listen(port, () =>
  console.log(
    `${chalk.white
      .bgHex('#41b883')
      .bold(`VUE TIL SERVER IS RUNNING ON ${port}`)}`,
  ),
);
