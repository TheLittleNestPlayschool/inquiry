const FRANCHISE_API =
    'https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/get_franchises';

const INQUIRY_API =
    'https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_inquiry_history';


/* ==========================================
   ELEMENTS
========================================== */

const newInquiryButton =
    document.getElementById(
        'newInquiryButton'
    );

const inquiryModal =
    document.getElementById(
        'inquiryModal'
    );

const closeInquiryModal =
    document.getElementById(
        'closeInquiryModal'
    );

const cancelInquiryButton =
    document.getElementById(
        'cancelInquiryButton'
    );

const inquiryForm =
    document.getElementById(
        'inquiryForm'
    );

const createInquiryButton =
    document.getElementById(
        'createInquiryButton'
    );

const parentNameInput =
    document.getElementById(
        'parentName'
    );

const franchiseSelect =
    document.getElementById(
        'franchiseSelect'
    );

const inquiryPanel =
    document.getElementById(
        'inquiryPanel'
    );

const emptyState =
    document.getElementById(
        'emptyState'
    );


/* ==========================================
   AUTH
========================================== */

function getAuthToken(){

    return localStorage.getItem(
        'authToken'
    );

}


/* ==========================================
   OPEN MODAL
========================================== */

function openInquiryModal(){

    inquiryModal.classList.add(
        'is-open'
    );

    inquiryModal.setAttribute(
        'aria-hidden',
        'false'
    );

    parentNameInput.focus();

    loadFranchises();

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeInquiry(){

    inquiryModal.classList.remove(
        'is-open'
    );

    inquiryModal.setAttribute(
        'aria-hidden',
        'true'
    );

    inquiryForm.reset();

    document.getElementById(
        'source'
    ).value = 'Facebook';

}


/* ==========================================
   LOAD FRANCHISES
========================================== */

async function loadFranchises(){

    franchiseSelect.innerHTML = '';


    const loadingOption =
        document.createElement(
            'option'
        );


    loadingOption.value = '';

    loadingOption.textContent =
        'Loading branches...';


    franchiseSelect.appendChild(
        loadingOption
    );


    try{

        const authToken =
            getAuthToken();


        if(!authToken){

            throw new Error(
                'Authentication token not found.'
            );

        }


        const response =
            await fetch(
                FRANCHISE_API,
                {
                    method:'GET',

                    headers:{
                        'Accept':
                            'application/json',

                        'Authorization':
                            `Bearer ${authToken}`
                    }
                }
            );


        if(!response.ok){

            throw new Error(
                `Unable to load franchises. HTTP ${response.status}`
            );

        }


        const franchises =
            await response.json();


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
    catch(error){

        console.error(
            'Franchise load failed:',
            error
        );


        franchiseSelect.innerHTML = '';


        const errorOption =
            document.createElement(
                'option'
            );


        errorOption.value = '';

        errorOption.textContent =
            'Unable to load branches';


        franchiseSelect.appendChild(
            errorOption
        );

    }

}


/* ==========================================
   CREATE INQUIRY
========================================== */

async function createInquiry(){

    const parentName =
        parentNameInput.value.trim();


    const franchiseId =
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


    const authToken =
        getAuthToken();


    if(!authToken){

        alert(
            'Your login session could not be found. Please log in again.'
        );

        return;

    }


    createInquiryButton.disabled =
        true;


    createInquiryButton.textContent =
        'Creating...';


    try{

        const response =
            await fetch(
                INQUIRY_API,
                {
                    method:'POST',

                    headers:{
                        'Content-Type':
                            'application/json',

                        'Accept':
                            'application/json',

                        'Authorization':
                            `Bearer ${authToken}`
                    },

                    body:
                        JSON.stringify({

                            parent_name:
                                parentName,

                            franchise_id:
                                franchiseId,

                            source:
                                'Facebook',

                            status:
                                'new'

                        })
                }
            );


        if(!response.ok){

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                'Unable to create inquiry.'
            );

        }


        const result =
            await response.json();


        const inquiry =
            result.qna_inquiry_history;


        const selectedOption =
            franchiseSelect.options[
                franchiseSelect.selectedIndex
            ];


        const franchiseName =
            selectedOption
                ? selectedOption.textContent
                : '';


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

        createInquiryButton.disabled =
            false;

        createInquiryButton.textContent =
            'Create Inquiry';

    }

}


/* ==========================================
   ADD INQUIRY CARD
========================================== */

function addInquiryCard(
    inquiry,
    franchiseName
){

    if(emptyState){

        emptyState.remove();

    }


    const card =
        document.createElement(
            'article'
        );


    card.className =
        'inquiry-card';


    card.dataset.id =
        inquiry.id;


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


    card.appendChild(
        top
    );


    card.appendChild(
        details
    );


    inquiryPanel.appendChild(
        card
    );

}


/* ==========================================
   EVENTS
========================================== */

newInquiryButton.addEventListener(
    'click',
    openInquiryModal
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
    event => {

        event.preventDefault();

        createInquiry();

    }
);


inquiryModal.addEventListener(
    'click',
    event => {

        if(
            event.target ===
            inquiryModal
        ){

            closeInquiry();

        }

    }
);
