/* ==========================================
   MODAL
========================================== */

import {
    inquiryModal,
    parentNameInput,
    inquiryForm
} from './inquiry_elements.js';


/* ==========================================
   OPEN MODAL
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


/* ==========================================
   CLOSE MODAL
========================================== */

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
