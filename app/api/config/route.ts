import { NextResponse } from "next/server";

import { getServerSideConfig } from "../../config/server";

const serverConfig = getServerSideConfig();

<<<<<<< HEAD
// Danger! Don not write any secret value here!
=======
// Danger! Do not hard code any secret value here!
>>>>>>> upstream/main
// 警告！不要在这里写入任何敏感信息！
const DANGER_CONFIG = {
  needCode: serverConfig.needCode,
  hideUserApiKey: serverConfig.hideUserApiKey,
<<<<<<< HEAD
  enableGPT4: serverConfig.enableGPT4,
  hideBalanceQuery: serverConfig.hideBalanceQuery,
=======
  disableGPT4: serverConfig.disableGPT4,
  hideBalanceQuery: serverConfig.hideBalanceQuery,
  disableFastLink: serverConfig.disableFastLink,
  customModels: serverConfig.customModels,
>>>>>>> upstream/main
};

declare global {
  type DangerConfig = typeof DANGER_CONFIG;
}

async function handle() {
  return NextResponse.json(DANGER_CONFIG);
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
