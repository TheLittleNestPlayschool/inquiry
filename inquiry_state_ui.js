
/* ==========================================
   INQUIRY STATE
========================================== */

import {
    inquiryPanel,
    emptyState
} from './inquiry_elements.js';


/* ==========================================
   LOADING STATE
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


/* ==========================================
   EMPTY STATE
========================================== */

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


/* ==========================================
   HIDE EMPTY STATE
========================================== */

export function hideEmptyState(){

    if(emptyState){

        emptyState.style.display =
            'none';

    }

}


/* ==========================================
   CLEAR INQUIRY CARDS
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
