// To store message streaming controller
export const ChatControllerPool = {
  controllers: {} as Record<string, AbortController>,

  addController(
<<<<<<< HEAD
    sessionIndex: number,
    messageId: number,
    controller: AbortController,
  ) {
    const key = this.key(sessionIndex, messageId);
=======
    sessionId: string,
    messageId: string,
    controller: AbortController,
  ) {
    const key = this.key(sessionId, messageId);
>>>>>>> upstream/main
    this.controllers[key] = controller;
    return key;
  },

<<<<<<< HEAD
  stop(sessionIndex: number, messageId: number) {
    const key = this.key(sessionIndex, messageId);
=======
  stop(sessionId: string, messageId: string) {
    const key = this.key(sessionId, messageId);
>>>>>>> upstream/main
    const controller = this.controllers[key];
    controller?.abort();
  },

  stopAll() {
    Object.values(this.controllers).forEach((v) => v.abort());
  },

  hasPending() {
    return Object.values(this.controllers).length > 0;
  },

<<<<<<< HEAD
  remove(sessionIndex: number, messageId: number) {
    const key = this.key(sessionIndex, messageId);
    delete this.controllers[key];
  },

  key(sessionIndex: number, messageIndex: number) {
    return `${sessionIndex},${messageIndex}`;
=======
  remove(sessionId: string, messageId: string) {
    const key = this.key(sessionId, messageId);
    delete this.controllers[key];
  },

  key(sessionId: string, messageIndex: string) {
    return `${sessionId},${messageIndex}`;
>>>>>>> upstream/main
  },
};
