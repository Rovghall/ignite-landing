/** Legal copy sourced from IGNITE AI mobile app (EN), July 9, 2026. */

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

export type LegalSection = {
  title: string
  blocks: LegalBlock[]
}

export type LegalDoc = {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export const privacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  lastUpdated: 'Last updated: July 9, 2026',
  intro:
    'This Privacy Policy explains how IGNITE AI ("IGNITE," "we," "us," or "our") collects, uses, stores, and shares personal information when you use the IGNITE AI mobile application and related services (the "Service"). We operate from the United Kingdom. This Policy works together with our Terms of use.',
  sections: [
    {
      title: '1. Who is responsible for your data',
      blocks: [
        {
          type: 'p',
          text: 'IGNITE AI is the controller of personal information described in this Policy, except where we process data solely on behalf of another party.',
        },
        { type: 'p', text: 'Privacy questions and requests: privacy@ignitehub.app.' },
      ],
    },
    {
      title: '2. Information we collect',
      blocks: [
        { type: 'p', text: 'Depending on how you use the Service, we may collect:' },
        {
          type: 'ul',
          items: [
            'Account information: email address and authentication identifiers from sign-in providers (Google, Apple, or email).',
            'Profile and plan data: name, birthdate, gender, height, weight, goals, activity level, diet preferences, step and water targets, and related onboarding choices.',
            'Nutrition and activity data: meal and drink logs, calories, macros, ingredients, exercise entries, fasting and water tracking, nutrition scores, and micronutrient guidance.',
            'Photos and media you choose to upload: meal photos, packaging label photos, progress photos, profile avatar, profile gallery photos and captions, and images sent in IGNITE AI Assistant chat.',
            'Voice input: audio you record for meal description is sent for transcription. We use the transcript to process your request. We do not intend to keep raw voice recordings in your account after transcription is complete.',
            'Text you provide: typed meal descriptions, chat messages, group chat and feed posts, feedback, and search queries.',
            'Health metrics (where you connect and grant permission): on supported devices, data from Apple Health or Health Connect such as steps, active calories, heart rate, sleep, or blood oxygen. Availability depends on platform and permissions.',
            'Device and app information: app version, language, time zone, push notification tokens, and technical logs needed to operate and secure the Service.',
            'Subscription and purchase information (when optional paid plans are available): plan type, subscription status, and transaction identifiers from Apple or Google. We do not receive or store your full payment card details.',
            'Friends and social data: display name, handle, bio, friend connections and requests, private group membership, group chat and feed posts, profile gallery media, likes and comments, invites and join requests, and wellness stats you choose to show on your friends profile.',
            'AI-generated diet plans and saved recipes based on your profile, goals, and preferences.',
            'Product usage preferences: share card theme favorites and export events when you use meal or exercise sharing features. This is used to improve sharing features, not for advertising.',
            "Per-group feed sharing settings: for each private group, whether you have chosen to automatically share new meal or workout logs to that group's feed.",
          ],
        },
      ],
    },
    {
      title: '3. How we use your information',
      blocks: [
        { type: 'p', text: 'We use personal information to:' },
        {
          type: 'ul',
          items: [
            'Provide the Service, including food logging, goals, plans, and progress tracking.',
            'Run AI-assisted features such as Snap Track, Snap Cook, label and barcode analysis, Describe, Voice, AI-generated diet plans, and IGNITE AI Assistant.',
            'Personalize calorie and macro targets and in-app coaching based on your profile and logs.',
            'Sync health-related metrics when you connect supported integrations.',
            'Send service and social notifications you enable, maintain security, prevent abuse, and fix errors.',
            'Process subscriptions when offered, respond to support requests, and comply with law.',
            'Operate Friends and private groups, including chat, feeds, profile galleries, leaderboards, and content you share with friends or group members.',
          ],
        },
        { type: 'p', text: 'We do not sell your health or meal data for advertising.' },
        {
          type: 'p',
          text: "Friends visibility: Accepted friends and group members may see information you share through Friends features, such as your profile, gallery media, posts, and stats you enable. Meal and workout logs are not posted to a group feed unless you share them manually or turn on automatic sharing for that group. You can adjust profile visibility and per-group feed sharing settings in the app.",
        },
      ],
    },
    {
      title: '4. AI processing',
      blocks: [
        {
          type: 'p',
          text: 'When you use AI features, content you submit (such as photos, text, voice for transcription, or chat messages) is processed on secure servers, including third-party infrastructure and AI providers we use to deliver the Service.',
        },
        {
          type: 'p',
          text: 'AI processing is used to generate suggestions and estimates only. Meal, exercise, recipe, and diet-plan suggestions are not saved to your diary until you review and confirm them in the app, except where a feature clearly auto-logs after analysis (as described in our Terms of use).',
        },
        {
          type: 'p',
          text: 'Do not submit sensitive information you do not want processed for this purpose. Features described as unlimited under a paid plan are subject to fair personal use rules in our Terms of use.',
        },
      ],
    },
    {
      title: '5. Friends and private groups',
      blocks: [
        {
          type: 'p',
          text: 'When you use Friends and Groups Room features, we process social and profile information to connect you with friends, operate private groups, and display shared content.',
        },
        {
          type: 'ul',
          items: [
            'Friend connections: sending and accepting friend requests, viewing friends profiles, and invite links or QR codes you use.',
            'Private groups: group names, membership, chat messages, feed posts, leaderboards, and meal or workout cards you share to a group.',
            'Profile gallery: photos, captions, likes, comments, and reactions on media you upload to your profile.',
            'Notifications: push or in-app alerts for friend requests, group activity, comments, likes, and invites when you enable them.',
          ],
        },
        {
          type: 'p',
          text: "Do not share content through Friends features that you do not want friends or group members to see. We may remove social content that violates our Terms or applicable law.",
        },
        {
          type: 'p',
          text: "Group feed sharing: For each private group, you can choose whether new meal or workout logs are posted to that group's feed automatically. These options are off by default. You can change them when joining a group or anytime from the Feed tab settings icon in the group.",
        },
      ],
    },
    {
      title: '6. Legal bases and regional information',
      blocks: [
        {
          type: 'p',
          text: 'United Kingdom and European Economic Area: Where UK GDPR or EU GDPR applies, we rely on one or more of the following legal bases:',
        },
        {
          type: 'ul',
          items: [
            'Contract: to provide the Service you request, including account, logging, plans, social features, and paid features when offered.',
            'Consent: where required, for example optional push notifications, Apple Health or Health Connect access, or microphone and camera permissions.',
            'Legitimate interests: to secure the Service, prevent abuse, improve reliability, and support users, balanced against your rights.',
            'Legal obligation: where we must retain or disclose information to comply with law.',
          ],
        },
        {
          type: 'p',
          text: 'United States: We process personal information as described in this Policy to provide and improve the Service. We do not sell your personal information for money. We do not share personal information for cross-context behavioral advertising. Depending on your state of residence, you may have additional rights under state privacy laws (for example in California, Virginia, or Colorado).',
        },
        {
          type: 'p',
          text: 'Australia: Where the Privacy Act 1988 (Cth) applies, we handle personal information in line with the Australian Privacy Principles (APPs). Consumer guarantees under the Australian Consumer Law may also apply and cannot be excluded where applicable (see our Terms of use).',
        },
      ],
    },
    {
      title: '7. How we share information',
      blocks: [
        { type: 'p', text: 'We may share personal information with:' },
        {
          type: 'ul',
          items: [
            'Service providers that help us host, store, authenticate users, process AI requests, deliver notifications, and operate the app (for example cloud hosting and authentication services).',
            'Apple and Google when you sign in or purchase subscriptions through their platforms.',
            'Authorities, regulators, or others when required by law or to protect rights, safety, and security.',
          ],
        },
        {
          type: 'p',
          text: 'We may use public nutrition databases to look up food information. We do not sell your personal data to third-party data providers.',
        },
        {
          type: 'p',
          text: 'If our business is reorganized, we may transfer information as part of that process with appropriate safeguards.',
        },
      ],
    },
    {
      title: '8. International transfers',
      blocks: [
        {
          type: 'p',
          text: 'We may process and store information in the United Kingdom and other countries where our service providers operate, including countries where you may live (such as the United States or Australia). Where required, we use appropriate safeguards for transfers outside the UK or EEA, such as standard contractual clauses.',
        },
      ],
    },
    {
      title: '9. How long we keep information',
      blocks: [
        {
          type: 'p',
          text: 'We keep personal information for as long as your account is active and as needed to provide the Service.',
        },
        {
          type: 'p',
          text: 'When you delete your account from Profile → Account, we delete or anonymize account-related data such as your profile, nutrition logs, diet plans, saved recipes, weight history, AI Assistant chat history, Friends connections, private groups you own, group posts and messages, profile gallery media, social notifications, share preferences, and related account records, subject to legal retention requirements and reasonable backup cycles.',
        },
        {
          type: 'p',
          text: 'Some information may remain in encrypted backups for a limited period before being overwritten. Feedback you send may be retained in anonymized form after account deletion where permitted by law.',
        },
        {
          type: 'p',
          text: 'Storage files such as photos may not always be removed immediately in every environment. We work to align deletion with account removal over time.',
        },
      ],
    },
    {
      title: '10. Security',
      blocks: [
        {
          type: 'p',
          text: 'We use technical and organizational measures designed to protect personal information, including access controls and encryption in transit. No online service can guarantee absolute security. Please use a strong sign-in method and notify us if you suspect unauthorized access.',
        },
      ],
    },
    {
      title: '11. Your choices and rights',
      blocks: [
        { type: 'p', text: 'Depending on where you live, you may have the right to:' },
        {
          type: 'ul',
          items: [
            'Access, correct, or delete personal information.',
            'Withdraw consent where processing is based on consent.',
            'Object to or restrict certain processing.',
            'Request portability of information you provided.',
            'Lodge a complaint with a supervisory authority.',
          ],
        },
        {
          type: 'p',
          text: 'You can update much of your profile in the app. For other requests, contact privacy@ignitehub.app. We may need to verify your identity.',
        },
        {
          type: 'p',
          text: "United Kingdom users may contact the Information Commissioner's Office (ICO). European Economic Area users may contact their local data protection authority.",
        },
        {
          type: 'p',
          text: 'United States residents: You may have the right to know what personal information we collect, to access, correct, or delete it, and to opt out of certain processing where applicable state law provides those rights. To make a request, email privacy@ignitehub.app. We will not discriminate against you for exercising privacy rights permitted by law.',
        },
        {
          type: 'p',
          text: 'Australia residents: You may request access to or correction of personal information we hold about you by contacting privacy@ignitehub.app. You may also lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.',
        },
      ],
    },
    {
      title: '12. Permissions and device settings',
      blocks: [
        {
          type: 'p',
          text: 'The Service may ask for camera, microphone, photo library, notification, and health permissions. You can change many of these in your device settings. Some features will not work without the relevant permission.',
        },
      ],
    },
    {
      title: '13. Children',
      blocks: [
        {
          type: 'p',
          text: 'The Service is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child under 13 has provided information, contact us so we can take appropriate steps.',
        },
      ],
    },
    {
      title: '14. Changes to this Policy',
      blocks: [
        {
          type: 'p',
          text: 'We may update this Privacy Policy from time to time. We will post the updated version in the app and on this website and change the "Last updated" date. Material changes may also be communicated in the app where appropriate.',
        },
      ],
    },
    {
      title: '15. Contact',
      blocks: [{ type: 'p', text: 'Questions about this Privacy Policy: privacy@ignitehub.app.' }],
    },
  ],
}

export const termsOfUse: LegalDoc = {
  title: 'Terms of use',
  lastUpdated: 'Last updated: July 9, 2026',
  intro:
    'These Terms of use ("Terms") govern your use of the IGNITE AI mobile application and related services (collectively, the "Service"), operated by IGNITE AI ("IGNITE," "we," "us," or "our") from the United Kingdom. The Service may be accessed in the United Kingdom, Portugal, United States, Australia, and other countries. By creating an account, accessing, or using the Service, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Service.',
  sections: [
    {
      title: '1. Eligibility',
      blocks: [
        {
          type: 'p',
          text: 'You must meet the minimum age required to use digital services in your country. You must be at least 13 years old. Children under 13 may not use the Service.',
        },
        {
          type: 'p',
          text: 'If you are under 18, or under the age of legal majority in your country, you may use the Service only with the consent and supervision of a parent or legal guardian who accepts these Terms on your behalf. In some countries (including parts of the European Economic Area), you must be at least 16 to use the Service without parental involvement.',
        },
        {
          type: 'p',
          text: 'The Service is not intended for individuals prohibited from using nutrition, fitness, or wellness tracking tools under applicable law. By using the Service, you represent that you meet these requirements.',
        },
      ],
    },
    {
      title: '2. What IGNITE provides',
      blocks: [
        {
          type: 'p',
          text: 'IGNITE AI is a wellness and nutrition tracking app. It helps you log meals and drinks, track calories and macros, set nutrition goals, monitor weight and activity-related metrics, and use AI-assisted tools to interpret food photos, packaging labels, barcodes, text descriptions, and voice input.',
        },
        {
          type: 'p',
          text: 'The Service currently includes features such as a daily food diary, personalized calorie and macro targets, Snap Track logging, Snap Cook AI recipe generation from photos, AI-generated diet meal plans, standalone exercise logging, IGNITE AI Assistant chat assistance, Friends and private groups (Groups Room), optional Apple Health and Health Connect integration where available, water and step goals, fasting tools, progress photos, nutrition and share cards, saved recipes, and related tools where available.',
        },
        {
          type: 'p',
          text: 'IGNITE is provided as a wellness support and tracking tool. It is not a medical device and does not provide medical care, diagnosis, treatment, or prevention of disease.',
        },
      ],
    },
    {
      title: '3. Snap Track',
      blocks: [
        {
          type: 'p',
          text: 'Snap Track lets you log food using photos, barcodes, packaging labels, typed descriptions, voice recordings, manual ingredient entry, direct macro entry, and food search. Depending on the input you provide, different recognition and estimation approaches may apply.',
        },
        {
          type: 'ul',
          items: [
            'Meal and drink photos: foods, beverages, and portions are identified. Successful analysis may save an entry to your diary automatically; you can open it afterward to review, edit ingredients, fix issues, or delete it.',
            'Barcode scans: products may be matched to nutrition databases when available and may be logged automatically on a successful match.',
            'Packaging labels: product and nutrition information may be read from your photo and, when analysis succeeds, may be logged automatically for your later review.',
            'Describe and Voice: text or transcribed speech is interpreted into suggested ingredients and portions that you review and confirm before logging.',
            'Insert macros: you may enter calories and macros directly without AI analysis.',
          ],
        },
        {
          type: 'p',
          text: 'Depending on the input, Snap Track may save an entry automatically after analysis (for example meal or packaged-food photos and successful barcode matches), or ask you to review and confirm first (for example Describe, Voice, and IGNITE AI Assistant). You should always review logged entries and edit or delete anything that looks inaccurate.',
        },
      ],
    },
    {
      title: '4. IGNITE AI Assistant',
      blocks: [
        {
          type: 'p',
          text: 'IGNITE AI Assistant provides conversational nutrition and wellness assistance. It may suggest meal or exercise estimates, answer questions about your goals or logged data, and help you explore food and activity information.',
        },
        {
          type: 'p',
          text: 'Meal and exercise suggestions in chat are previews only. Nothing is saved to your food diary or activity totals until you review the suggestion and explicitly confirm it in the app. Chat responses may be inaccurate, incomplete, or unsuitable for your individual circumstances.',
        },
      ],
    },
    {
      title: '5. Snap Cook, diet plans, exercise, and sharing',
      blocks: [
        {
          type: 'p',
          text: 'Snap Cook uses AI to suggest recipes from photos of ingredients or meals you provide. Suggestions are starting points. Review ingredients, portions, and nutrition before saving or logging.',
        },
        {
          type: 'p',
          text: 'AI-generated diet plans create suggested meals for days or weeks based on your profile, goals, and preferences. Plans are suggestions only. You can edit, replace, or ignore any suggested meal.',
        },
        {
          type: 'p',
          text: 'Exercise logging lets you record workouts and estimated burn. Estimates are not clinically precise. Exercise suggestions from IGNITE AI Assistant follow the same review-and-confirm rules as meals.',
        },
        {
          type: 'p',
          text: 'Share cards let you export or share meal or exercise summaries using themes you select. Shared images may leave the app through your device share sheet. You control what you share and with whom.',
        },
      ],
    },
    {
      title: '6. Friends and private groups',
      blocks: [
        {
          type: 'p',
          text: 'Friends features let you connect with other users, join private accountability groups, chat, share meal or workout updates, view profile galleries, and receive social notifications when enabled.',
        },
        {
          type: 'p',
          text: "Content you post in a group or share with friends may be visible to members of that group or your accepted friends. Respect others' privacy and only share content you have the right to share.",
        },
        {
          type: 'p',
          text: 'Group owners may invite members, manage membership, and delete groups they created. We may remove groups or social content that violate these Terms or create risk for users.',
        },
        {
          type: 'p',
          text: "Meal and workout logs are not posted to a group feed unless you share them manually or enable automatic sharing for that group. Automatic sharing is optional, off by default, and can be controlled separately for meals and exercise in each group's Feed tab.",
        },
        {
          type: 'ul',
          items: [
            'Do not harass, bully, or post harmful content in groups or on profiles.',
            "Do not share another person's photos or health information without permission where required by law.",
          ],
        },
      ],
    },
    {
      title: '7. Health, activity, and body metrics',
      blocks: [
        {
          type: 'p',
          text: 'You may enter or sync health-related information such as weight, height, steps, and, on supported devices with your permission, data from Apple Health or Health Connect (for example steps, active calories, heart rate, sleep, or blood oxygen). Availability depends on your device, operating system, and permissions you grant.',
        },
        {
          type: 'p',
          text: 'Any synced or displayed health data is for general wellness tracking only and is not medical monitoring, clinical measurement, or emergency detection.',
        },
      ],
    },
    {
      title: '8. Medical and wellness disclaimers',
      blocks: [
        {
          type: 'p',
          text: 'Information in the Service, including calorie counts, macros, nutrition scores, meal suggestions, fasting guidance, exercise burn estimates, and AI-generated content, is for general informational and wellness purposes only. It is not personal medical advice and is not a substitute for advice from a qualified doctor, registered dietitian, or other licensed health professional.',
        },
        {
          type: 'p',
          text: 'Do not use the Service for medical emergencies. If you think you may have a medical emergency, contact emergency services immediately.',
        },
        {
          type: 'p',
          text: 'Consult a qualified health professional before making significant changes to your diet, exercise, fasting routine, or weight-management plan, especially if you are pregnant, nursing, managing diabetes or another chronic condition, taking medication, recovering from illness, or have a history of disordered eating.',
        },
        {
          type: 'p',
          text: 'The Service is not designed for users actively managing an eating disorder without professional supervision. If you have or suspect an eating disorder, seek qualified care before using calorie-tracking features.',
        },
        {
          type: 'p',
          text: 'During pregnancy and breastfeeding, nutritional needs are different; do not follow calorie goals, fasting guidance, or weight-loss plans in the app without guidance from a qualified health professional. If you have any physical or health condition, take the same precaution: consult a qualified professional before following goals or guidance from the Service.',
        },
      ],
    },
    {
      title: '9. Nutrition data and accuracy',
      blocks: [
        {
          type: 'p',
          text: 'Nutrition values in IGNITE may come from public food databases, recognized product information, ingredient analysis, and AI-assisted estimation. Product recognition may use visible product names, packaging, barcodes, nutrition labels, and database matching.',
        },
        {
          type: 'p',
          text: 'Database entries may be incomplete, outdated, or incorrect. AI-assisted results are estimates and may misidentify foods, portions, ingredients, or allergens. Homemade meals, restaurant dishes, mixed plates, and regional products are especially uncertain.',
        },
        {
          type: 'p',
          text: 'Treat all results as estimates unless you have independently verified them. Database-matched packaged products are usually more reliable than AI-only suggestions.',
        },
      ],
    },
    {
      title: '10. AI-assisted analysis',
      blocks: [
        {
          type: 'p',
          text: 'IGNITE uses advanced AI models hosted on secure servers to help interpret photos, labels, descriptions, and chat messages. AI outputs are starting points, not guarantees. They may be wrong, outdated, or inappropriate for your needs.',
        },
        {
          type: 'p',
          text: 'You remain responsible for what you log. Do not rely on AI results for allergy safety, medical nutrition therapy, or other high-risk decisions without professional verification.',
        },
        {
          type: 'p',
          text: 'Some features may be described as "unlimited" or included in a paid plan when offered. This means reasonable personal, non-commercial use for logging your own meals, drinks, and wellness data through Snap Track, IGNITE AI Assistant, and related tools. It does not permit automated requests, bulk processing, reselling access, sharing one subscription across multiple unrelated users, or any use that places disproportionate load on the Service. We may apply technical limits or suspend access if we detect abusive or anomalous use.',
        },
      ],
    },
    {
      title: '11. Your responsibilities',
      blocks: [
        {
          type: 'ul',
          items: [
            'Review and edit suggested or auto-logged meals, drinks, ingredients, portions, and macros. Correct or delete entries that look wrong.',
            'Provide accurate account and profile information where requested.',
            'Use the Service lawfully and only for personal, non-commercial purposes unless we agree otherwise in writing.',
            'Keep your sign-in credentials secure and notify us if you suspect unauthorized access to your account.',
            'Do not upload content you do not have the right to share, including photos of other people without permission where required by law.',
          ],
        },
      ],
    },
    {
      title: '12. User content',
      blocks: [
        {
          type: 'p',
          text: 'You may submit content to the Service, including meal logs, photos, voice input for transcription, chat messages, profile information, profile gallery media, group posts and messages, progress photos, and feedback ("User Content"). You retain ownership of your User Content.',
        },
        {
          type: 'p',
          text: 'By submitting User Content, you grant IGNITE a worldwide, non-exclusive, royalty-free license to host, store, reproduce, process, display, and use that content only as needed to operate, secure, improve, and provide the Service, including AI-assisted analysis and support. This license ends when your content is deleted, except where retention is required by law or legitimate backup practices.',
        },
        {
          type: 'p',
          text: 'We may remove content or suspend access if we reasonably believe it violates these Terms, applicable law, or the rights of others.',
        },
      ],
    },
    {
      title: '13. Acceptable use',
      blocks: [
        { type: 'p', text: 'You agree not to:' },
        {
          type: 'ul',
          items: [
            'Use the Service for unlawful, harmful, fraudulent, or abusive purposes.',
            'Attempt to reverse engineer, scrape, overload, or disrupt the Service or its systems.',
            'Upload malware, spam, or content that is harassing, hateful, sexually exploitative, or promotes unsafe weight-loss practices or eating disorders.',
            'Misrepresent your identity or impersonate another person.',
            'Use the Service to provide medical advice to third parties or as a substitute for professional healthcare services.',
            'Use scripts, bots, or other automation to send AI analysis requests, barcode lookups, or chat messages.',
            'Share a paid subscription or account with others in a way that replaces separate subscriptions or enables commercial use.',
            'Resell, republish, or commercially exploit outputs from AI features without our written permission.',
            'Harass, threaten, or abuse other users in Friends features, groups, comments, or profile galleries.',
          ],
        },
      ],
    },
    {
      title: '14. Subscriptions and paid features',
      blocks: [
        {
          type: 'p',
          text: 'IGNITE offers free access to core wellness features. We may also offer optional paid subscription plans in some regions. When available, prices, billing periods (for example weekly, monthly, or yearly), trials, and included features are shown in the app at the time of purchase.',
        },
        {
          type: 'p',
          text: 'Paid subscriptions are processed by Apple, Google, or other authorized payment providers. Their terms and privacy policies apply to billing and refunds.',
        },
        {
          type: 'p',
          text: 'Subscriptions renew automatically unless you cancel before the end of the current billing period through your App Store or Google Play account settings. Deleting the IGNITE app does not cancel your subscription.',
        },
        {
          type: 'p',
          text: 'If a free trial is offered, you will be charged when the trial ends unless you cancel before that date. Trial length and eligibility are shown at purchase.',
        },
        {
          type: 'p',
          text: 'Features described as unlimited under a paid plan are subject to the fair personal use rules in Section 10. Normal daily meal logging is not considered abuse.',
        },
      ],
    },
    {
      title: '15. Account and security',
      blocks: [
        {
          type: 'p',
          text: 'You may sign in using supported methods such as Google, Apple, or email. You are responsible for all activity under your account unless caused by our fault. We may suspend or terminate accounts that violate these Terms or create security, legal, or operational risk.',
        },
      ],
    },
    {
      title: '16. Third-party services',
      blocks: [
        {
          type: 'p',
          text: 'The Service may rely on or link to third-party services, including sign-in providers, cloud hosting, nutrition databases, and device health platforms. Those services are governed by their own terms and policies. We do not control and are not responsible for third-party services.',
        },
        {
          type: 'p',
          text: 'IGNITE may use third-party nutrition databases and data providers under their respective licenses and terms. Where required, we comply with attribution and usage obligations for those sources.',
        },
      ],
    },
    {
      title: '17. Intellectual property',
      blocks: [
        {
          type: 'p',
          text: 'The Service, including its software, design, branding, and documentation, is owned by IGNITE or its licensors and is protected by intellectual property laws. We grant you a limited, personal, non-transferable, revocable license to use the app according to these Terms.',
        },
        {
          type: 'p',
          text: 'You may not copy, modify, distribute, sell, or create derivative works from the Service except as allowed by law or with our written permission.',
        },
      ],
    },
    {
      title: '18. Disclaimers',
      blocks: [
        {
          type: 'p',
          text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        },
        {
          type: 'p',
          text: 'We do not warrant that the Service will be uninterrupted, error-free, secure, or that nutrition, health, or AI outputs will be accurate, complete, or suitable for your purposes.',
        },
      ],
    },
    {
      title: '19. Limitation of liability',
      blocks: [
        {
          type: 'p',
          text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, IGNITE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, DATA, GOODWILL, OR HEALTH-RELATED OUTCOMES, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.',
        },
        {
          type: 'p',
          text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE CLAIM, OR (B) FIFTY POUNDS STERLING (£50) OR THE APPROXIMATE LOCAL CURRENCY EQUIVALENT.',
        },
        {
          type: 'p',
          text: 'Some jurisdictions do not allow certain limitations. In those cases, our liability is limited to the fullest extent permitted by applicable law. Nothing in these Terms limits liability that cannot be limited under mandatory consumer protection law.',
        },
      ],
    },
    {
      title: '20. Indemnification',
      blocks: [
        {
          type: 'p',
          text: 'To the maximum extent permitted by law, you agree to indemnify and hold harmless IGNITE from claims, damages, losses, and expenses (including reasonable legal fees) arising from your User Content, your misuse of the Service, or your violation of these Terms or applicable law.',
        },
      ],
    },
    {
      title: '21. Termination and account deletion',
      blocks: [
        {
          type: 'p',
          text: 'You may stop using the Service at any time. You may delete your account from Profile → Account. When deletion completes, we will delete or anonymize account-related data as described in our Privacy Policy, subject to legal retention requirements and reasonable backup cycles.',
        },
        {
          type: 'p',
          text: 'We may suspend or terminate your access if you materially breach these Terms or if necessary to protect users, the Service, or our legal obligations.',
        },
      ],
    },
    {
      title: '22. Changes to the Service and Terms',
      blocks: [
        {
          type: 'p',
          text: 'We may modify, suspend, or discontinue any part of the Service at any time. We may update these Terms by posting a revised version in the app and on this website and updating the "Last updated" date. Material changes may also be communicated in the app where appropriate.',
        },
        {
          type: 'p',
          text: 'If you continue using the Service after updated Terms take effect, you accept the revised Terms. If you do not agree, you must stop using the Service and may delete your account.',
        },
      ],
    },
    {
      title: '23. Governing law and international users',
      blocks: [
        {
          type: 'p',
          text: 'IGNITE operates the Service from the United Kingdom. These Terms are governed by the laws of England and Wales, except where mandatory consumer protection laws in your country of residence require otherwise.',
        },
        {
          type: 'p',
          text: 'If you are a consumer in the United Kingdom, nothing in these Terms excludes or limits your statutory rights under the Consumer Rights Act 2015 and other applicable UK law.',
        },
        {
          type: 'p',
          text: 'If you are a consumer in the European Economic Area, Portugal, or Switzerland, you retain any mandatory rights under the laws of your country of residence, including rights that cannot be waived by contract.',
        },
        {
          type: 'p',
          text: 'If you are a consumer in the United States, you retain any rights under applicable federal or state consumer protection laws that cannot be waived by agreement.',
        },
        {
          type: 'p',
          text: 'If you are a consumer in Australia, our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law where applicable. Nothing in these Terms is intended to exclude, restrict, or modify those non-excludable rights.',
        },
        {
          type: 'p',
          text: 'Subject to mandatory local law, courts in England and Wales have exclusive jurisdiction over disputes arising from these Terms. Where your local law gives you the right to bring claims in your country of residence as a consumer, that right is not affected.',
        },
      ],
    },
    {
      title: '24. Contact',
      blocks: [
        { type: 'p', text: 'Questions about these Terms may be sent to support@ignitehub.app.' },
        { type: 'p', text: 'For privacy-related requests, see our Privacy Policy.' },
      ],
    },
  ],
}
