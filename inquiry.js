const FRANCHISE_API =
    'https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/get_franchises';


const INQUIRY_API =
    'https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_inquiry_history';


const newInquiryButton =
    document.getElementById(
        'newInquiryButton'
    );


const newInquiryModal =
    document.getElementById(
        'newInquiryModal'
    );


const closeInquiryModal =
    document.getElementById(
        'closeInquiryModal'
    );


const cancelInquiry =
    document.getElementById(
        'cancelInquiry'
    );


const createInquiryButton =
    document.getElementById(
        'createInquiry'
    );


const parentNameInput =
    document.getElementById(
        'parentName'
    );


const franchiseSelect =
    document.getElementById(
        'franchise'
    );


const inquiryPanel =
    document.getElementById(
        'inquiryPanel'
    );


const emptyState =
    document.getElementById(
        'emptyState'
    );


function getAuthToken(){

    return localStorage.getItem(
        'authToken'
    );

}


function openInquiryModal(){

    newInquiryModal.classList.add(
        'is-open'
    );

    newInquiryModal.setAttribute(
        'aria-hidden',
        'false'
    );

    parentNameInput.focus();

    loadFranchises();

}


function closeInquiry(){

    newInquiryModal.classList.remove(
        'is-open'
    );

    newInquiryModal.setAttribute(
        'aria-hidden',
        'true'
    );

    parentNameInput.value = '';

    franchiseSelect.value = '';

}


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
                (a,b)=>
                    a.name.localeCompare(
                        b.name
                    )
            )
            .forEach(
                franchise =>{

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


        const franchise =
            franchiseSelect.options[
                franchiseSelect.selectedIndex
            ];


        const franchiseName =
            franchise
                ? franchise.textContent
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


    const status =
        document.createElement(
            'span'
        );


    status.className =
        'inquiry-status';


    status.textContent =
        inquiry.status;


    top.appendChild(
        name
    );


    top.appendChild(
        status
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


    branch.innerHTML =
        `
            <span>Branch</span>
            <strong>${franchiseName}</strong>
        `;


    const source =
        document.createElement(
            'div'
        );


    source.innerHTML =
        `
            <span>Source</span>
            <strong>${inquiry.source}</strong>
        `;


    details.appendChild(
        branch
    );


    details.appendChild(
        source
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


newInquiryButton.addEventListener(
    'click',
    openInquiryModal
);


closeInquiryModal.addEventListener(
    'click',
    closeInquiry
);


cancelInquiry.addEventListener(
    'click',
    closeInquiry
);


createInquiryButton.addEventListener(
    'click',
    createInquiry
);


newInquiryModal.addEventListener(
    'click',
    event =>{

        if(
            event.target ===
            newInquiryModal
        ){

            closeInquiry();

        }

    }
);
