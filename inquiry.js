import {
    getFranchises,
    getActiveInquiries,
    getClosedInquiries,
    reopenInquiry,
    createInquiry
} from './inquiry_api.js';

import {
    newInquiryButton,
    inquiryModal,
    closeInquiryModal,
    cancelInquiryButton,
    inquiryForm,
    createInquiryButton,
    parentNameInput,
    franchiseSelect,
    inquiryPanel,
    openInquiryModal,
    closeInquiry,
    populateFranchises,
    showFranchiseLoading,
    showFranchiseError,
    showLoadingState,
    showEmptyState,
    hideEmptyState,
    clearInquiryCards,
    addInquiryCard,
    updateCardTimer
} from './inquiry_ui.js';

import {
    setClosedLookupResults,
    getClosedInquirySelect,
    closeClosedLookup
} from './inquiry_closed_menu.js';

/* STATE */

let franchises=[];
let franchiseMap={};
let timerInterval=null;

/* INITIALIZE */

async function initialize(){
    showLoadingState();

    try{
        const [
            franchiseData,
            inquiryData
        ]=await Promise.all([
            getFranchises(),
            getActiveInquiries()
        ]);

        franchises=franchiseData || [];
        buildFranchiseMap();
        populateFranchises(franchises);
        renderActiveInquiries(inquiryData);
        startTimer();
    }
    catch(error){
        console.error(
            'Inquiry initialization failed:',
            error
        );

        clearInquiryCards();
        showEmptyState();
    }
}

/* FRANCHISE MAP */

function buildFranchiseMap(){
    franchiseMap={};

    franchises.forEach(
        franchise=>{
            franchiseMap[
                String(franchise.id)
            ]=franchise.name;
        }
    );
}

/* RENDER ACTIVE INQUIRIES */

function renderActiveInquiries(
    inquiries
){
    clearInquiryCards();

    if(
        !inquiries ||
        inquiries.length===0
    ){
        showEmptyState();
        return;
    }

    hideEmptyState();

    inquiries.forEach(
        inquiry=>{
            const franchiseName=
                franchiseMap[
                    String(inquiry.franchise_id)
                ] ||
                'Unknown Branch';

            addInquiryCard(
                inquiry,
                franchiseName
            );
        }
    );
}

/* TIMER */

function updateAllTimers(){
    const cards=
        inquiryPanel.querySelectorAll(
            '.inquiry-card'
        );

    cards.forEach(
        card=>{
            const timestamp=
                Number(
                    card.dataset.lastActivity
                );

            updateCardTimer(
                card,
                timestamp
            );
        }
    );
}

function startTimer(){
    if(timerInterval){
        clearInterval(timerInterval);
    }

    updateAllTimers();

    timerInterval=
        setInterval(
            updateAllTimers,
            30000
        );
}

/* CLOSED INQUIRY SEARCH */

async function handleClosedInquirySearch(
    event
){
    const {
        from,
        to,
        button
    }=event.detail;

    try{
        const records=
            await getClosedInquiries(
                from,
                to
            );

        setClosedLookupResults(
            records
        );
    }
    catch(error){
        console.error(
            'Closed inquiry search failed:',
            error
        );

        alert(
            'Unable to load closed inquiries. Please try again.'
        );

        if(button){
            button.disabled=false;
            button.textContent='Search';
        }
    }
}

/* REOPEN CLOSED INQUIRY */

async function handleClosedInquirySelection(){
    const select=
        getClosedInquirySelect();

    const selectedOption=
        select.selectedOptions[0];

    if(
        !selectedOption ||
        !selectedOption.value
    ){
        return;
    }

    const inquiryId=
        Number(
            selectedOption.value
        );

    if(!inquiryId){
        return;
    }

    select.disabled=true;

    try{
        await reopenInquiry(
            inquiryId
        );

        const inquiryData=
            await getActiveInquiries();

        renderActiveInquiries(
            inquiryData
        );

        closeClosedLookup();
    }
    catch(error){
        console.error(
            'Reopen inquiry failed:',
            error
        );

        alert(
            'Unable to reopen the inquiry. Please try again.'
        );
    }
    finally{
        select.disabled=false;
    }
}

/* NEW INQUIRY */

async function handleCreateInquiry(){
    const parentName=
        parentNameInput.value.trim();

    const franchiseId=
        Number(
            franchiseSelect.value
        );

    if(!parentName){
        alert(
            'Please enter the parent or client name.'
        );

        parentNameInput.focus();
        return;
    }

    if(!franchiseId){
        alert(
            'Please select a franchise.'
        );

        franchiseSelect.focus();
        return;
    }

    createInquiryButton.disabled=true;
    createInquiryButton.textContent='Creating...';

    try{
        const inquiry=
            await createInquiry(
                parentName,
                franchiseId
            );

        const franchiseName=
            franchiseMap[
                String(franchiseId)
            ] ||
            'Unknown Branch';

        addInquiryCard(
            inquiry,
            franchiseName
        );

        closeInquiry();
    }
    catch(error){
        console.error(
            'Create inquiry failed:',
            error
        );

        alert(
            'Unable to create the inquiry. Please try again.'
        );
    }
    finally{
        createInquiryButton.disabled=false;
        createInquiryButton.textContent='Create Inquiry';
    }
}

/* MODAL FRANCHISE LOADING */

async function prepareNewInquiry(){
    openInquiryModal();

    if(franchises.length>0){
        populateFranchises(
            franchises
        );

        return;
    }

    showFranchiseLoading();

    try{
        franchises=
            await getFranchises();

        buildFranchiseMap();

        populateFranchises(
            franchises
        );
    }
    catch(error){
        console.error(
            'Franchise load failed:',
            error
        );

        showFranchiseError();
    }
}

/* EVENTS */

newInquiryButton.addEventListener(
    'click',
    prepareNewInquiry
);

closeInquiryModal.addEventListener(
    'click',
    closeInquiry
);

cancelInquiryButton.addEventListener(
    'click',
    closeInquiry
);

inquiryForm.addEventListener(
    'submit',
    event=>{
        event.preventDefault();
        handleCreateInquiry();
    }
);

inquiryModal.addEventListener(
    'click',
    event=>{
        if(
            event.target===
            inquiryModal
        ){
            closeInquiry();
        }
    }
);

document.addEventListener(
    'closedInquiryDateSearch',
    handleClosedInquirySearch
);

getClosedInquirySelect().addEventListener(
    'change',
    handleClosedInquirySelection
);

/* START */

initialize();
