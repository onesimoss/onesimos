# 📖 Onesimos — Beta Tester Guide (v0.9)

Welcome to the **Onesimos** private beta!

Onesimos is a **Living Reading Companion** designed for children ages **3 to 9**, with a focus on African families at home and in the diaspora. Onesimos listens to your child read aloud, detects stumbling vocabulary without penalizing character or place names, and gives parents clear, honest progress insights.

---

## 🎯 What to Test During Your Session

### 1. Child Selection & PIN Gating (`/who`)

- Switch between child profiles.
- If a 4-digit **Kid PIN** is set, verify that entering the PIN grants access to that child's reading portal.

### 2. Story Selection & Free-Plan Quotas

- In the Kid View, check your child's **Daily Time Allowance** pill (20, 30, or 45 mins).
- Check the **Free Stories** counter (`3 of 3 left`).
- **Free Plan Restriction:** Accounts on the free tier can complete up to **3 stories per calendar month** per child. Attempting to start a 4th story will display a calm Parent Unlock prompt.

### 3. Read-Aloud Experience & Speech Detection

- Tap **"Read now"** to open a story.
- Grant microphone permissions when prompted.
- Have your child read the page text clearly into the device microphone.
- Observe real-time audio detection and page progression.

### 4. Reading Summary & Tap-to-Hear Vocabulary (`summary`)

- Upon completing a story, review the celebration stars and badges:
  - 🟡 **Words to Practice (Warm Gold):** Words your child hesitated on or mispronounced. Tap any gold chip to hear it spoken aloud clearly (🔊).
  - 🟣 **Character & Place Names (Soft Purple):** Names met during the story (e.g., _Tayo_, _Amaka_, _Lagos_). These are celebrated as character names, not reading mistakes.

### 5. Kid Word Pocket (`/kid/[childId]`)

- Return to the Kid Home page and scroll down to **"My Word Pocket"**.
- Verify that recent practice words persist here so children can tap and practice them anytime between story sessions.

### 6. Parent Portal & 4-Digit Security Code (`/parent`)

- Click **"Parent Portal & Settings"** from any child screen.
- Enter your secret **4-Digit Parent Unlock Code**.
- On the Parent Dashboard, test:
  - Viewing reading day streaks, total pages read, and session counts.
  - Setting or changing child 4-digit PINs.
  - Configuring **Story Time Reminders** and preferred notification times.
  - Setting or changing your secret 4-Digit Parent PIN.

---

## 💡 Known Beta Limitations & Design Choices

1. **African Name Pronunciation:**
   Browser voice synthesis works well for standard English vocabulary, but device voices frequently mispronounce African names (e.g., pronouncing _Tayo_ as _"TAYYOH"_). In this beta, purple Name badges are intentionally quiet until our custom native audio pack is installed.
2. **Offline Caching:**
   This beta requires an active internet connection for Deepgram speech recognition. Full offline reading and offline spelling games will launch in v1.1.

---

## 🔄 How to Reset Test Data (For Testers & Admin)

If you hit the 3-story monthly limit while testing and want to reset a child profile to start fresh:

1. Tap **"🔒 Parent Portal"** and enter your secret 4-digit code.
2. On the target child's profile card, click **"🔄 Reset Test Quota"**.
3. This purges test reading sessions for that child and instantly restores their 3 free stories allowance.

_(Note: Parent accounts registered under admin emails like `onesimos@examplemirror.com` automatically receive unlimited reading access during testing)._

---

## 📩 Feedback & Support

Please report any blank screens, layout issues, or speech recognition bugs directly to Mitchel with:

- Your device model (e.g. iPad 9th Gen, Samsung Galaxy S22, iPhone 14)
- Browser used (Chrome, Safari, Firefox)
- A brief description or screenshot of what happened.

_Thank you for helping build Onesimos!_
