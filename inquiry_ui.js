/* ==========================================
   ELEMENTS
========================================== */

export const newInquiryButton =
    document.getElementById(
        'newInquiryButton'
    );

export const inquiryModal =
    document.getElementById(
        'inquiryModal'
    );

export const closeInquiryModal =
    document.getElementById(
        'closeInquiryModal'
    );

export const cancelInquiryButton =
    document.getElementById(
        'cancelInquiryButton'
    );

export const inquiryForm =
    document.getElementById(
        'inquiryForm'
    );

export const createInquiryButton =
    document.getElementById(
        'createInquiryButton'
    );

export const parentNameInput =
    document.getElementById(
        'parentName'
    );

export const franchiseSelect =
    document.getElementById(
        'franchiseSelect'
    );

export const inquiryPanel =
    document.getElementById(
        'inquiryPanel'
    );

export const emptyState =
    document.getElementById(
        'emptyState'
    );


/* ==========================================
   MODAL
========================================== */

export function openInquiryModal(){

    inquiryModal.classList.add(
        'is-open'
    );

    inquiryModal.setAttribute(
        'aria-hidden',
        'false'
    );

    parentNameInput.focus();

}


export function closeInquiry(){

    inquiryModal.classList.remove(
        'is-open'
    );

    inquiryModal.setAttribute(
        'aria-hidden',
        'true'
    );

    inquiryForm.reset();


    const source =
        document.getElementById(
            'source'
        );


    if(source){

        source.value =
            'Facebook';

    }

}


/* ==========================================
   FRANCHISE DROPDOWN
========================================== */

export function populateFranchises(
    franchises
){

    franchiseSelect.innerHTML = '';


    const defaultOption =
        document.createElement(
            'option'
        );

    defaultOption.value = '';

    defaultOption.textContent =
        'Select a branch';


    franchiseSelect.appendChild(
        defaultOption
    );


    franchises
        .filter(
            franchise =>
                franchise.status ===
                'active'
        )
        .sort(
            (a,b) =>
                a.name.localeCompare(
                    b.name
                )
        )
        .forEach(
            franchise => {

                const option =
                    document.createElement(
                        'option'
                    );

                option.value =
                    franchise.id;

                option.textContent =
                    franchise.name;


                franchiseSelect.appendChild(
                    option
                );

            }
        );

}


/* ==========================================
   FRANCHISE LOADING
========================================== */

export function showFranchiseLoading(){

    franchiseSelect.innerHTML = '';


    const option =
        document.createElement(
            'option'
        );

    option.value = '';

    option.textContent =
        'Loading branches...';


    franchiseSelect.appendChild(
        option
    );

}


export function showFranchiseError(){

    franchiseSelect.innerHTML = '';


    const option =
        document.createElement(
            'option'
        );

    option.value = '';

    option.textContent =
        'Unable to load branches';


    franchiseSelect.appendChild(
        option
    );

}


/* ==========================================
   EMPTY STATE
========================================== */

export function showLoadingState(){

    if(!emptyState){

        return;

    }


    const title =
        emptyState.querySelector(
            '.empty-state-title'
        );

    const text =
        emptyState.querySelector(
            '.empty-state-text'
        );


    if(title){

        title.textContent =
            'Loading inquiries...';

    }


    if(text){

        text.textContent =
            'Loading active inquiries.';

    }


    emptyState.style.display =
        'flex';

}


export function showEmptyState(){

    if(!emptyState){

        return;

    }


    const title =
        emptyState.querySelector(
            '.empty-state-title'
        );

    const text =
        emptyState.querySelector(
            '.empty-state-text'
        );


    if(title){

        title.textContent =
            'No inquiries yet';

    }


    if(text){

        text.textContent =
            'Create a new inquiry to begin tracking a parent and their conversation with the playschool.';

    }


    emptyState.style.display =
        'flex';

}


export function hideEmptyState(){

    if(emptyState){

        emptyState.style.display =
            'none';

    }

}


/* ==========================================
   CLEAR CARDS
========================================== */

export function clearInquiryCards(){

    const cards =
        inquiryPanel.querySelectorAll(
            '.inquiry-card'
        );


    cards.forEach(
        card =>
            card.remove()
    );

}


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


/* ==========================================
   THREE-HOUR GAUGE
========================================== */

/*
   The gauge represents 3 hours.

   0 hours  = top
   1 hour   = 4 o'clock position
   2 hours  = 8 o'clock position
   3 hours  = top again

   One complete rotation = 3 hours.

   60 minutes  = 120 degrees
   120 minutes = 240 degrees
   180 minutes = 360 degrees
*/

function getGaugeRotation(
    timestamp
){

    const elapsed =
        getElapsedMilliseconds(
            timestamp
        );


    const threeHours =
        3 *
        60 *
        60 *
        1000;


    if(
        elapsed >=
        threeHours
    ){

        return 360;

    }


    return (
        elapsed /
        threeHours
    ) *
    360;

}


/* ==========================================
   CREATE GAUGE
========================================== */

function createInquiryGauge(
    timestamp
){

    const gauge =
        document.createElement(
            'div'
        );


    gauge.className =
        'inquiry-gauge';


    gauge.setAttribute(
        'aria-hidden',
        'true'
    );


    const face =
        document.createElement(
            'div'
        );


    face.className =
        'inquiry-gauge-face';


    /*
     * Fixed hour labels.
     *
     * Top = 0
     * 4 o'clock = 1
     * 8 o'clock = 2
     */

    const label1 =
        document.createElement(
            'span'
        );


    label1.className =
        'gauge-label gauge-label-1';


    label1.textContent =
        '1';


    const label2 =
        document.createElement(
            'span'
        );


    label2.className =
        'gauge-label gauge-label-2';


    label2.textContent =
        '2';


    /*
     * Moving hand
     */

    const hand =
        document.createElement(
            'span'
        );


    hand.className =
        'inquiry-gauge-hand';


    hand.style.transform =
        `translateX(-50%) rotate(${getGaugeRotation(timestamp)}deg)`;


    /*
     * Center pivot
     */

    const center =
        document.createElement(
            'span'
        );


    center.className =
        'inquiry-gauge-center';


    face.appendChild(
        label1
    );

    face.appendChild(
        label2
    );

    face.appendChild(
        hand
    );

    face.appendChild(
        center
    );


    gauge.appendChild(
        face
    );


    return gauge;

}


/* ==========================================
   UPDATE CARD
========================================== */

export function updateCardTimer(
    card,
    timestamp
){

    const timer =
        card.querySelector(
            '.inquiry-card-timer'
        );


    if(timer){

        timer.textContent =
            formatElapsedTime(
                timestamp
            );

    }


    const hand =
        card.querySelector(
            '.inquiry-gauge-hand'
        );


    if(hand){

        hand.style.transform =
            `translateX(-50%) rotate(${getGaugeRotation(timestamp)}deg)`;

    }

}


/* ==========================================
   CREATE CARD
========================================== */

export function addInquiryCard(
    inquiry,
    franchiseName
){

    hideEmptyState();


    const card =
        document.createElement(
            'article'
        );


    card.className =
        'inquiry-card';


    card.dataset.id =
        inquiry.id;


    card.dataset.lastActivity =
        inquiry.last_activity_at ||
        0;


    /*
     * Card content
     */

    const content =
        document.createElement(
            'div'
        );


    content.className =
        'inquiry-card-content';


    const name =
        document.createElement(
            'h3'
        );


    name.className =
        'inquiry-card-name';


    name.textContent =
        inquiry.parent_name;


    content.appendChild(
        name
    );


    const branch =
        document.createElement(
            'div'
        );


    branch.className =
        'inquiry-card-branch';


    branch.textContent =
        franchiseName;


    content.appendChild(
        branch
    );


    const timer =
        document.createElement(
            'div'
        );


    timer.className =
        'inquiry-card-timer';


    timer.textContent =
        formatElapsedTime(
            inquiry.last_activity_at
        );


    content.appendChild(
        timer
    );


    /*
     * Gauge
     */

    const gauge =
        createInquiryGauge(
            inquiry.last_activity_at
        );


    card.appendChild(
        content
    );


    card.appendChild(
        gauge
    );


    inquiryPanel.appendChild(
        card
    );


    return card;

}
