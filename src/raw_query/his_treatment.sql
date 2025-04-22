his_treatment
-- Query to get treatment records within a time range
SELECT 
    ID, 
    Name,
    TO_CHAR(
        TO_DATE(IN_TIME, 'YYYYMMDDHH24MISS'),
        'DD/MM/YYYY HH24:MI:SS'
    ) as IN_TIME
FROM HIS_TREATMENT 
WHERE IN_TIME BETWEEN :TIME_FROM AND :TIME_TO 