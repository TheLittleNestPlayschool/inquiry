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
   FRANCHISE LOADING STATE
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
   TIMER FORMAT
========================================== */

export function formatElapsedTime(
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

        return '--';

    }


    const elapsed =
        Math.max(
            0,
            Date.now() - time
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
   UPDATE CARD TIMER
========================================== */

export function updateCardTimer(
    card,
    timestamp
){

    const timer =
        card.querySelector(
            '.inquiry-card-timer'
        );


    if(!timer){

        return;

    }


    timer.textContent =
        formatElapsedTime(
            timestamp
        );

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


    const top =
        document.createElement(
            'div'
        );


    top.className =
        'inquiry-card-top';


    const name =
        document.createElement(
            'h3'
        );


    name.className =
        'inquiry-card-name';


    name.textContent =
        inquiry.parent_name;


    top.appendChild(
        name
    );


    const details =
        document.createElement(
            'div'
        );


    details.className =
        'inquiry-card-details';


    const branch =
        document.createElement(
            'div'
        );


    const branchName =
        document.createElement(
            'strong'
        );


    branchName.textContent =
        franchiseName;


    branch.appendChild(
        branchName
    );


    details.appendChild(
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


    details.appendChild(
        timer
    );


    card.appendChild(
        top
    );


    card.appendChild(
        details
    );


    inquiryPanel.appendChild(
        card
    );


    return card;

}
