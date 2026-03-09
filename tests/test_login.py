"""
VerdiTrust Login Selenium Test Suite
=====================================
Tests: valid login, invalid login, sign-up form, navigation, admin redirect
Requirements: pip install selenium webdriver-manager pytest
Chrome must be installed.
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# ── Configuration ──────────────────────────────────────────────────────────────
BASE_URL = "http://localhost:5173"

# Update these with real Firebase credentials
VALID_BUYER_EMAIL    = "senilcyriac@gmail.com"
VALID_BUYER_PASSWORD = "senil@2004"
ADMIN_EMAIL          = "admin@gmail.com"
ADMIN_PASSWORD       = "admin123"

WRONG_PASSWORD       = "definitelyWrongPass999"
NEW_USER_NAME        = "Selenium Tester"
NEW_USER_EMAIL       = f"sel_{int(time.time())}@autotest.com"
NEW_USER_PASSWORD    = "AutoTest@2026"

SHORT_WAIT  = 2
NORMAL_WAIT = 12


# ── Helpers ────────────────────────────────────────────────────────────────────
def make_driver() -> webdriver.Chrome:
    opts = Options()
    # opts.add_argument("--headless=new")  # uncomment for headless
    opts.add_argument("--window-size=1400,900")
    opts.add_argument("--disable-notifications")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=opts
    )
    driver.implicitly_wait(4)
    return driver


def wait_for(driver, by, selector, timeout=NORMAL_WAIT):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, selector))
    )


def wait_clickable(driver, by, selector, timeout=NORMAL_WAIT):
    return WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, selector))
    )


def fill_email_password(driver, email, password):
    email_field = wait_for(driver, By.CSS_SELECTOR, "input[name='email']")
    email_field.clear()
    email_field.send_keys(email)
    pass_field = driver.find_element(By.CSS_SELECTOR, "input[name='password']")
    pass_field.clear()
    pass_field.send_keys(password)


def click_submit(driver):
    btn = wait_clickable(driver, By.CSS_SELECTOR, "button[type='submit']")
    btn.click()


def click_signup_toggle(driver):
    """Click the 'Request New Hub Access' button to switch to sign-up mode."""
    toggle = wait_clickable(
        driver, By.XPATH,
        "//button[@type='button' and contains(., 'Request New Hub Access')]"
    )
    toggle.click()
    time.sleep(SHORT_WAIT)


# ══════════════════════════════════════════════════════════════════════════════
class TestLoginPage(unittest.TestCase):

    def setUp(self):
        self.driver = make_driver()
        self.driver.get(f"{BASE_URL}/login")
        time.sleep(SHORT_WAIT)

    def tearDown(self):
        self.driver.quit()

    # ── TC-01: Login page loads ───────────────────────────────────────────────
    def test_01_login_page_loads(self):
        print("\n[TC-01] Login page loads correctly")
        driver = self.driver
        self.assertIn("VerdiTrust", driver.title)
        heading = wait_for(driver, By.CSS_SELECTOR, "h1")
        self.assertTrue(heading.is_displayed())
        print(f"       Title : {driver.title}")
        print(f"       H1    : {heading.text}")

    # ── TC-02: Empty form validation ─────────────────────────────────────────
    def test_02_empty_form_validation(self):
        print("\n[TC-02] Empty submit shows validation errors")
        driver = self.driver
        click_submit(driver)
        time.sleep(1)
        errors = driver.find_elements(By.CSS_SELECTOR, "p.text-rose-400")
        self.assertGreater(len(errors), 0, "Should show at least one validation error")
        print(f"       Errors visible: {len(errors)}")

    # ── TC-03: Wrong password shows error banner ──────────────────────────────
    def test_03_invalid_password(self):
        print("\n[TC-03] Wrong password shows auth error")
        driver = self.driver
        fill_email_password(driver, VALID_BUYER_EMAIL, WRONG_PASSWORD)
        click_submit(driver)
        error = wait_for(driver, By.CSS_SELECTOR, "div.bg-rose-500\\/10", timeout=15)
        self.assertTrue(error.is_displayed())
        print(f"       Error text: {error.text[:80]}")

    # ── TC-04: Admin login redirects to /admin ────────────────────────────────
    def test_04_admin_redirect(self):
        print("\n[TC-04] Admin login redirects to /admin")
        driver = self.driver
        fill_email_password(driver, ADMIN_EMAIL, ADMIN_PASSWORD)
        click_submit(driver)
        WebDriverWait(driver, 20).until(EC.url_contains("/admin"))
        self.assertIn("/admin", driver.current_url)
        print(f"       Redirected: {driver.current_url}")

    # ── TC-05: Valid buyer login redirects to /buyer or /seller ──────────────
    def test_05_valid_buyer_login(self):
        print("\n[TC-05] Valid buyer login redirects to dashboard")
        driver = self.driver
        fill_email_password(driver, VALID_BUYER_EMAIL, VALID_BUYER_PASSWORD)
        click_submit(driver)
        WebDriverWait(driver, 20).until(
            lambda d: "/buyer" in d.current_url or "/seller" in d.current_url
        )
        self.assertTrue("/buyer" in driver.current_url or "/seller" in driver.current_url)
        print(f"       Redirected: {driver.current_url}")

    # ── TC-06: Toggle to sign-up shows name field ─────────────────────────────
    def test_06_switch_to_signup(self):
        print("\n[TC-06] Toggle to sign-up shows name field and updated heading")
        driver = self.driver
        click_signup_toggle(driver)
        name_fields = driver.find_elements(By.CSS_SELECTOR, "input[name='name']")
        self.assertGreater(len(name_fields), 0, "Name field should appear after toggle")
        heading = driver.find_element(By.CSS_SELECTOR, "h1")
        self.assertIn("Create", heading.text)
        print(f"       H1 after toggle: {heading.text}")

    # ── TC-07: Sign-up password mismatch ─────────────────────────────────────
    def test_07_signup_password_mismatch(self):
        print("\n[TC-07] Password mismatch shows error in sign-up mode")
        driver = self.driver
        click_signup_toggle(driver)

        driver.find_element(By.CSS_SELECTOR, "input[name='name']").send_keys("Test User")
        driver.find_element(By.CSS_SELECTOR, "input[name='email']").send_keys("x@test.com")
        driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys("Password@1")
        confirm = driver.find_element(By.CSS_SELECTOR, "input[name='confirmPassword']")
        confirm.send_keys("DifferentPass@9")
        confirm.send_keys(Keys.TAB)
        time.sleep(0.7)

        errors = driver.find_elements(By.CSS_SELECTOR, "p.text-rose-400")
        has_mismatch = any("match" in e.text.lower() for e in errors)
        self.assertTrue(has_mismatch, "Should show password mismatch error")
        print("       Mismatch error detected ✓")

    # ── TC-08: Google SSO button visible ─────────────────────────────────────
    def test_08_google_button_visible(self):
        print("\n[TC-08] Google sign-in button is visible")
        driver = self.driver
        btn = wait_for(driver, By.XPATH,
                       "//button[contains(., 'Continue with Google')]")
        self.assertTrue(btn.is_displayed())
        print("       Google button visible ✓")

    # ── TC-09: Forgot password link navigates ────────────────────────────────
    def test_09_forgot_password_link(self):
        print("\n[TC-09] 'Forgot Key?' link navigates to /forgot-password")
        driver = self.driver
        link = wait_clickable(driver, By.XPATH, "//a[contains(., 'Forgot Key')]")
        link.click()
        WebDriverWait(driver, 10).until(EC.url_contains("/forgot-password"))
        self.assertIn("/forgot-password", driver.current_url)
        print(f"       Navigated to: {driver.current_url}")

    # ── TC-10: New user sign-up (end-to-end) ─────────────────────────────────
    def test_10_new_user_signup(self):
        print(f"\n[TC-10] New user sign-up → {NEW_USER_EMAIL}")
        driver = self.driver
        click_signup_toggle(driver)

        driver.find_element(By.CSS_SELECTOR, "input[name='name']").send_keys(NEW_USER_NAME)
        driver.find_element(By.CSS_SELECTOR, "input[name='email']").send_keys(NEW_USER_EMAIL)
        driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys(NEW_USER_PASSWORD)
        driver.find_element(By.CSS_SELECTOR, "input[name='confirmPassword']").send_keys(NEW_USER_PASSWORD)
        click_submit(driver)

        try:
            WebDriverWait(driver, 20).until(
                lambda d: "/buyer" in d.current_url or "/seller" in d.current_url
            )
            self.assertTrue("/buyer" in driver.current_url or "/seller" in driver.current_url)
            print(f"       Sign-up OK → {driver.current_url}")
        except Exception:
            errors = driver.find_elements(By.CSS_SELECTOR, "div.bg-rose-500\\/10")
            msg = errors[0].text if errors else "no error shown"
            self.fail(f"Sign-up failed. URL: {driver.current_url}  Error: {msg}")


# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    loader = unittest.TestLoader()
    loader.sortTestMethodsUsing = lambda a, b: (a > b) - (a < b)
    suite = loader.loadTestsFromTestCase(TestLoginPage)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    print("\n" + "=" * 60)
    print(f"  Tests run : {result.testsRun}")
    print(f"  Passed    : {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"  Failures  : {len(result.failures)}")
    print(f"  Errors    : {len(result.errors)}")
    print("=" * 60)
