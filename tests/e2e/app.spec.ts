import { expect, test } from "@playwright/test";

test("home opens and switches between Chinese and English", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /写下今天发生的事/ })).toBeVisible();

  await page.getByRole("link", { name: "EN" }).click();
  await expect(page.getByRole("heading", { name: /Write down what happened today/ })).toBeVisible();

  await page.getByRole("link", { name: "中文" }).click();
  await expect(page.getByRole("heading", { name: /写下今天发生的事/ })).toBeVisible();
});

test("unauthenticated /generate redirects to login", async ({ page }) => {
  await page.goto("/generate");
  await expect(page).toHaveURL(/\/auth/);
  await expect(page.getByRole("heading", { name: "登录 Realis" })).toBeVisible();
});

test("AI reflection uses E2E mock and can save to gallery", async ({ page }) => {
  await page.goto("/reflect");
  await page.getByLabel("具体事件").fill("今天会议里，我准备很久的方案被很快跳过了。");
  await page.getByRole("button", { name: "委屈" }).click();
  await page.getByLabel("相关人物").fill("同事");
  await page.getByRole("button", { name: "生成 AI 觉察" }).click();

  await expect(page.getByRole("heading", { name: "会议里被跳过的方案" })).toBeVisible();
  await page.getByRole("button", { name: "保存到时光画廊" }).click();
  await expect(page.getByRole("button", { name: "已保存到时光画廊" })).toBeVisible();

  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: "会议里被跳过的方案" })).toBeVisible();
});

test("memory gallery and relationship compass render in E2E mode", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: "记忆画廊" })).toBeVisible();

  await page.goto("/compass");
  await expect(page.getByRole("heading", { name: "人际罗盘" })).toBeVisible();
  await expect(page.getByText("MBTI 倾向仅用于自我理解")).toBeVisible();
});
