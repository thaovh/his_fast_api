-- Query to get paginated list of patients
SELECT * FROM (
    SELECT a.*, ROWNUM rnum FROM (
        SELECT 
            ID,
            PATIENT_NAME,
            DATE_OF_BIRTH,
            GENDER,
            ADDRESS,
            PHONE_NUMBER
        FROM HIS_PATIENT
        ORDER BY ID
    ) a WHERE ROWNUM <= :LIMIT + :OFFSET
) WHERE rnum > :OFFSET 