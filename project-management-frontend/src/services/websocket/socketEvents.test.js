import { SOCKET_EVENTS } from './socketEvents'

describe('socket call events', () => {
  it('builds chat call destinations for a project', () => {
    expect(SOCKET_EVENTS.CALL.REQUEST('abc123')).toBe('/app/project/abc123/call.request')
    expect(SOCKET_EVENTS.CALL.RECEIVE('abc123')).toBe('/topic/project/abc123/call')
  })
})
