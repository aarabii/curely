-- =====================================================
-- Curely Demo Data SQL Script
-- Database: PostgreSQL (Neon-compatible)
-- Description: Sample medical consultation reports for demonstration
-- =====================================================

-- Create demo_reports table
CREATE TABLE IF NOT EXISTS demo_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_symptoms TEXT NOT NULL,
    ai_analysis TEXT NOT NULL,
    suggested_steps TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    agent_name VARCHAR(255),
    patient_name VARCHAR(255),
    severity VARCHAR(50),
    duration VARCHAR(100)
);

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_demo_reports_session_id ON demo_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_demo_reports_generated_at ON demo_reports(generated_at DESC);

-- =====================================================
-- Sample Report 1: General Physician - Common Cold
-- =====================================================
INSERT INTO demo_reports (
    session_id,
    agent_name,
    patient_name,
    patient_symptoms,
    ai_analysis,
    suggested_steps,
    severity,
    duration
) VALUES (
    'demo-session-001-general',
    'General Physician AI',
    'Sarah Martinez',
    'Persistent cough, mild fever (99.5°F), runny nose, slight body aches, fatigue, occasional sneezing',
    'Based on the consultation, the patient presents with classic symptoms of an upper respiratory tract infection, most likely a common cold or viral infection. The fever is low-grade, which is typical for viral infections. The combination of cough, runny nose, and body aches along with a 3-day symptom duration suggests the infection is in its active phase. No severe symptoms such as difficulty breathing or chest pain were reported, which is reassuring. The patient mentioned adequate fluid intake and rest, which are appropriate self-care measures.',
    'Continue resting and staying well-hydrated with water, herbal teas, and clear broths. Use over-the-counter acetaminophen or ibuprofen for fever and body aches (follow package instructions). Consider using a humidifier to ease congestion and throat irritation. Monitor temperature twice daily and watch for worsening symptoms. Seek immediate medical attention if fever exceeds 103°F, symptoms persist beyond 10 days, or if difficulty breathing develops. Isolate from others to prevent spread and practice good hand hygiene.',
    'Mild',
    '3 days'
);

-- =====================================================
-- Sample Report 2: Cardiologist - Hypertension Follow-up
-- =====================================================
INSERT INTO demo_reports (
    session_id,
    agent_name,
    patient_name,
    patient_symptoms,
    ai_analysis,
    suggested_steps,
    severity,
    duration
) VALUES (
    'demo-session-002-cardio',
    'Cardiologist AI',
    'Robert Chen',
    'Elevated blood pressure readings (145/92 mmHg average), occasional mild headaches, family history of heart disease, sedentary lifestyle',
    'The patient reports consistently elevated blood pressure readings over the past two weeks, averaging 145/92 mmHg, which falls into Stage 1 Hypertension according to current guidelines. While the patient is currently asymptomatic beyond occasional mild headaches, the family history of cardiovascular disease and sedentary lifestyle are significant risk factors. The patient is not currently on any antihypertensive medications and has expressed interest in lifestyle modifications. Blood pressure at these levels, if sustained, increases risk of heart disease, stroke, and kidney problems. The consultation revealed willingness to make dietary changes and increase physical activity.',
    'Schedule an in-person appointment with a cardiologist within 2 weeks for comprehensive cardiovascular assessment and possible medication initiation. Begin a heart-healthy diet rich in fruits, vegetables, whole grains, and lean proteins while limiting sodium to less than 2,300mg daily (consider the DASH diet). Start with 30 minutes of moderate aerobic exercise (brisk walking) 5 days per week, gradually increasing intensity. Monitor and log blood pressure readings twice daily (morning and evening) at the same times. Reduce stress through relaxation techniques such as deep breathing or meditation. Limit alcohol consumption and avoid tobacco products completely. If blood pressure exceeds 180/120 mmHg or severe headache, chest pain, or vision changes occur, seek emergency care immediately.',
    'Moderate',
    '2 weeks'
);

-- =====================================================
-- Sample Report 3: Dermatologist - Skin Rash
-- =====================================================
INSERT INTO demo_reports (
    session_id,
    agent_name,
    patient_name,
    patient_symptoms,
    ai_analysis,
    suggested_steps,
    severity,
    duration
) VALUES (
    'demo-session-003-derm',
    'Dermatologist AI',
    'Anonymous User',
    'Red, itchy rash on both forearms, small raised bumps, mild scaling, recent use of new laundry detergent, no pain or blistering',
    'The patient presents with a localized erythematous rash characterized by pruritus (itching), small papules (raised bumps), and mild desquamation (scaling) affecting both forearms symmetrically. The temporal correlation between symptom onset and the introduction of a new laundry detergent strongly suggests allergic contact dermatitis as the primary diagnosis. The bilateral and symmetric distribution pattern is typical for contactant exposure. The absence of vesiculation (blistering), severe pain, or systemic symptoms such as fever indicates this is a localized, non-severe reaction. The patient reported no previous similar reactions or known allergies to common detergent ingredients.',
    'Immediately discontinue use of the new laundry detergent and rewash all recently laundered clothing with a hypoallergenic, fragrance-free alternative. Apply over-the-counter hydrocortisone 1% cream to affected areas twice daily for up to 7 days to reduce inflammation and itching. Take an oral antihistamine like cetirizine (Zyrtec) or loratadine (Claritin) once daily to manage itching. Keep skin moisturized with a fragrance-free, hypoallergenic moisturizer. Avoid scratching the affected area to prevent secondary infection. If the rash spreads, develops blistering, shows signs of infection (increased warmth, pus, severe pain), or does not improve within 7-10 days, schedule an appointment with a dermatologist for evaluation and possible patch testing.',
    'Mild',
    '4 days'
);

-- =====================================================
-- Sample Report 4: Psychologist - Anxiety Management
-- =====================================================
INSERT INTO demo_reports (
    session_id,
    agent_name,
    patient_name,
    patient_symptoms,
    ai_analysis,
    suggested_steps,
    severity,
    duration
) VALUES (
    'demo-session-004-psych',
    'Psychologist AI',
    'Emily Thompson',
    'Persistent worry and racing thoughts, difficulty concentrating at work, trouble falling asleep, occasional heart palpitations, feeling overwhelmed by daily tasks, muscle tension in shoulders and neck',
    'The patient describes a constellation of symptoms consistent with generalized anxiety that has been interfering with daily functioning for approximately six weeks. The cognitive symptoms (persistent worry, racing thoughts, concentration difficulties) are accompanied by physical manifestations including sleep disturbances, palpitations, and muscle tension. The patient reports that work-related stress has been a primary trigger, with increased responsibilities and upcoming deadlines exacerbating symptoms. No past psychiatric history was disclosed, and the patient has not previously sought mental health treatment. The patient expressed motivation to learn coping strategies and is open to both therapeutic intervention and lifestyle modifications. No current suicidal ideation or self-harm thoughts were reported.',
    'Consider scheduling an appointment with a licensed therapist or counselor who specializes in anxiety disorders for comprehensive assessment and evidence-based treatment such as Cognitive Behavioral Therapy (CBT). Practice daily relaxation techniques including deep breathing exercises (4-7-8 breathing method) or progressive muscle relaxation for 10-15 minutes. Establish a consistent sleep routine: go to bed and wake at the same time daily, avoid screens 1 hour before bed, and create a calming bedtime ritual. Engage in regular physical activity such as walking, yoga, or swimming for at least 30 minutes, 5 days per week to reduce stress hormones. Limit caffeine intake, especially after noon, as it can exacerbate anxiety and sleep problems. Consider using a journal to identify anxiety triggers and track mood patterns. If symptoms worsen significantly or any thoughts of self-harm develop, contact a mental health crisis line or emergency services immediately. Resources: National Crisis Hotline 988.',
    'Moderate',
    '6 weeks'
);

-- =====================================================
-- Sample Report 5: Nutritionist - Weight Management
-- =====================================================
INSERT INTO demo_reports (
    session_id,
    agent_name,
    patient_name,
    patient_symptoms,
    ai_analysis,
    suggested_steps,
    severity,
    duration
) VALUES (
    'demo-session-005-nutrition',
    'Nutritionist AI',
    'Michael Johnson',
    'Gradual weight gain of 15 pounds, low energy levels, frequent fast food consumption, irregular meal timing, minimal vegetable intake, sedentary job',
    'The patient has experienced a 15-pound weight gain over the past six months, which correlates with significant dietary and lifestyle changes following a job transition to a desk-based role. Current dietary habits include frequent consumption of processed foods, fast food meals 4-5 times weekly, irregular meal timing with skipped breakfasts, and minimal intake of fruits and vegetables (less than 2 servings daily). The patient reports low energy levels throughout the day and reliance on caffeinated beverages for alertness. Physical activity is limited to weekend recreational activities. The patient has expressed genuine motivation to improve eating habits and achieve gradual, sustainable weight loss. No underlying medical conditions or current medications were reported that would contradict standard nutritional recommendations.',
    'Begin by establishing a regular meal schedule with three balanced meals daily, starting with a protein-rich breakfast within one hour of waking. Gradually increase vegetable intake to 3-5 servings per day and incorporate 2-3 servings of whole fruits. Reduce fast food consumption to once weekly maximum, and when dining out, choose grilled proteins with vegetable sides. Practice portion control using the "plate method": fill half your plate with vegetables, one quarter with lean protein, and one quarter with whole grains. Stay hydrated with 8-10 glasses of water daily and limit sugary beverages and excess caffeine. Incorporate movement breaks every hour during work: stand, stretch, or take short walks. Aim for 150 minutes of moderate-intensity exercise weekly, such as brisk walking, cycling, or swimming. Keep a food diary for 2 weeks to increase awareness of eating patterns. Consider consulting with a registered dietitian for a personalized meal plan if independent progress is challenging.',
    'Mild',
    '6 months'
);

-- =====================================================
-- Verification Query
-- =====================================================
-- Uncomment to verify the data was inserted successfully:
-- SELECT
--     session_id,
--     agent_name,
--     patient_name,
--     severity,
--     duration,
--     generated_at
-- FROM demo_reports
-- ORDER BY generated_at DESC;

-- =====================================================
-- Cleanup (Optional)
-- =====================================================
-- Uncomment the following line to remove demo data:
-- DROP TABLE IF EXISTS demo_reports CASCADE;
