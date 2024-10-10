export const GOOGLE_LOGIN_CLIENT_ID =
  typeof process !== 'undefined'
    ? process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID!
    : '35194126501-0031o60q44nangd909vgvbul8vdvqvp6.apps.googleusercontent.com'
// export const GOOGLE_LOGIN_CLIENT_ID =
//   process?.env?.REACT_APP_GOOGLE_LOGIN_CLIENT_ID ??
//   '35194126501-0031o60q44nangd909vgvbul8vdvqvp6.apps.googleusercontent.com';

export const ACCEPTED_MEDIA_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',
  'video/mp4',
  'video/mov',
  'video/avi',
  'video/mpeg4',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg'
]
