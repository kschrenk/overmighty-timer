export const TEST_USER = "test-user";

export function isUidTestUser(uid?: string) {
  return uid === TEST_USER;
}
