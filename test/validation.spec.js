//테스트 코드 실행 시 실제로는 데이터베이스에 연결되지 않도록 하기
//각 조건 별로 2개 이상의 테스트 케이스가 존재하도록 하기

const connect = require("../schemas");
const server = require('../app');
const supertest = require('supertest');
const User = require("../models/user");

const userIds = [];
beforeAll(async () => {
    await connect();
    const user = await User.create({ nickname: 'something', password: '1234' });
    userIds.push(user._id);
});

describe('test for auth', () => {
    app = supertest(server);
    it('too short password', async () => {
        const res = await app.get('/api/users').send({
          nickname: 'another',
            password: '123',
            confirmPassword: '123',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.');
    });

    it('password includes username', async () => {
        const res = await app.get('/api/users').send({
          nickname: 'another',
            password: 'another',
            confirmPassword: 'another',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.');
    });

    it('duplicated username', async () => {
        const res = await app.get('/api/users').send({
          nickname: 'something',
            password: '12345678',
            confirmPassword: '12345678',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('중복된 닉네임입니다.');
    });

    it('weird username', async () => {
        const res = await app.get('/api/users').send({
          nickname: '가나다라마',
            password: '12345678',
            confirmPassword: '12345678',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다.');
    });

    it('too short username', async () => {
        const res = await app.get('/api/users').send({
          nickname: 'a',
            password: '12345678',
            confirmPassword: '12345678',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다.');
    });

    it('incorrect password and passwordConfirmation', async () => {
        const res = await app.get('/api/users').send({
          nickname: 'superman',
            password: 'asdfqwer',
            confirmPassword: '12345678',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('비밀번호가 일치하지 않습니다.');
    });

    it('incorrect password and passwordConfirmation', async () => {
        const res = await app.get('/api/users').send({
          nickname: 'superman',
            password: 'waterbalm',
            confirmPassword: 'waterbaml',
        });
        expect(res.status).toBe(400);
        expect(res.text).toBe('비밀번호가 일치하지 않습니다.');
    });
});

afterAll(async () => {
    await User.deleteMany({ _id: userIds });
})