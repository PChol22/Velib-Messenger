export default {
  type: "object",
  properties: {
    lat: { type: 'number' },
    lon: { type: 'number' },
    hours: { type: 'number' },
    minutes: { type: 'number' },
    email: { type: 'string' },
  },
  required: ['lat', 'lon', 'hours', 'minutes', 'email']
} as const;
