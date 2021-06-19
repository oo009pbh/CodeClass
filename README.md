# CODE CLASS에 오신것을 환영합니다.



## 소개

코딩강의를 위한 새로운 화상강의 플랫폼 코드클래스 입니다! 라이브코딩 기능과 코딩기록 기능을 이용하여 좀더 교육자와 학생이 소통을 쉽게 할 수 있도록 구성했습니다.
팀원 : 이충무, 박병훈, 오창민, 변효근, 이준규

![CODECLASS](https://user-images.githubusercontent.com/80251711/122398723-1eefe300-cfb5-11eb-94b7-02d6932c169b.png)

## 프로젝트 구성안내

우리 프로그램의 구조입니다.

![img](https://lh3.googleusercontent.com/-WlJHTbApq4UzHvv9hs0cT5RhH1Kx5lHbmYYt-itXnMP1TrYbQwHtCS-NxrJSIsZ9PU_nEv-AyaJSMiEwRMIj-OMW87jLxT4gIQGSW6q_Vy_A-lz6JEIZGFgHCA0VX4JdWLRwgqE)
팀

## 프로젝트 설치 및 실행법



#### 코드 복제

```
git clone https://github.com/oo009pbh/CodeClass.git
```

#### 도커 설치 및 openvidu 이미지 실행

1. docker 설치
2. docker kitematic 설치
3. kitematic cli 에서 다음 명령어 실행 (your-ip 에 와이파이 ip를 써주세요)

```
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e DOMAIN_OR_PUBLIC_IP=[your-ip] openvidu/openvidu-server-kms:2.18.0
```

#### 코드 실행

1. 모듈설치 및 실행

   ```
   npm install
   npm start
   ```

2. ngrok 설치  https://ngrok.com/

3. cmd에서 ngrok 실행

   ```
   cd 프로젝트폴더 위치
   ngrok http 3000
   ```

4. 생성된 https 주소로 접속 (같은 와이파이만 됩니다)

   

## 저작권 및 사용권 정보

openvidu : https://github.com/OpenVidu/openvidu/blob/master/LICENSE

codemirror : https://github.com/codemirror/CodeMirror/blob/master/LICENSE
