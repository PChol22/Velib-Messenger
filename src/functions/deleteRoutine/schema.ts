export default {
  type: "object",
  properties: {
    schedule: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['schedule', 'email']
} as const;
