-- Query to get treatments for a specific patient
SELECT 
    t.ID,
    t.NAME,
    t.IN_TIME,
    t.OUT_TIME,
    t.STATUS
FROM HIS_TREATMENT t
WHERE t.PATIENT_ID = :ID
ORDER BY t.IN_TIME DESC 