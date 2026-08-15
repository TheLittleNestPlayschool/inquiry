/* ==========================================
   ELAPSED TIME
========================================== */

export function getElapsedMilliseconds(
    timestamp
){

    const time =
        Number(
            timestamp
        );


    if(
        !time ||
        time <= 0
    ){

        return 0;

    }


    return Math.max(
        0,
        Date.now() - time
    );

}


/* ==========================================
   FORMAT ELAPSED TIME
========================================== */

export function formatElapsedTime(
    timestamp
){

    const elapsed =
        getElapsedMilliseconds(
            timestamp
        );


    const totalMinutes =
        Math.floor(
            elapsed /
            60000
        );


    const hours =
        Math.floor(
            totalMinutes /
            60
        );


    const minutes =
        totalMinutes %
        60;


    if(hours > 0){

        return `${hours}h ${minutes}m`;

    }


    return `${minutes}m`;

}
