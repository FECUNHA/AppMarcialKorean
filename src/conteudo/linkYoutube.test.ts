import { extrairIdYoutube } from './linkYoutube'

describe('extrairIdYoutube (R13, design D2)', () => {
  test.each([
    ['https://www.youtube.com/watch?v=2mG4A7Sr1fU&t=5s', '2mG4A7Sr1fU'],
    ['https://youtube.com/watch?feature=share&v=qjrYw-LjlB0', 'qjrYw-LjlB0'],
    ['https://m.youtube.com/watch?v=qjrYw-LjlB0', 'qjrYw-LjlB0'],
    ['https://music.youtube.com/watch?v=qjrYw-LjlB0&si=abc', 'qjrYw-LjlB0'],
    ['https://youtu.be/qjrYw-LjlB0', 'qjrYw-LjlB0'],
    ['https://youtu.be/qjrYw-LjlB0?si=xyz&t=12', 'qjrYw-LjlB0'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/M7lc1UVf-VE?start=3', 'M7lc1UVf-VE'],
    ['https://www.youtube-nocookie.com/embed/M7lc1UVf-VE', 'M7lc1UVf-VE'],
    ['https://www.youtube.com/live/qjrYw-LjlB0', 'qjrYw-LjlB0'],
    ['  https://youtu.be/qjrYw-LjlB0  ', 'qjrYw-LjlB0'],
  ])('%s → %s', (url, id) => {
    expect(extrairIdYoutube(url)).toBe(id)
  })

  test.each([
    'https://vimeo.com/123456',
    'https://www.youtube.com/playlist?list=PL123',
    'https://www.youtube.com/watch?v=curto',
    'https://www.youtube.com/@canal',
    'https://evil.com/watch?v=qjrYw-LjlB0',
    'https://youtube.com.evil.com/watch?v=qjrYw-LjlB0',
    'qjrYw-LjlB0',
    'não é link',
    '',
  ])('%s → null', (url) => {
    expect(extrairIdYoutube(url)).toBeNull()
  })
})
