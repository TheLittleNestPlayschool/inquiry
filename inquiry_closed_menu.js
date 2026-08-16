/* CLOSED INQUIRY LOOKUP MENU */

const menuContainer=document.createElement('div');
menuContainer.className='closed-lookup-menu';
menuContainer.setAttribute('aria-hidden','true');

menuContainer.innerHTML=`
    <div class="closed-lookup-header">
        <div>
            <h3>Lookup Closed</h3>
            <p>Find a previous conversation.</p>
        </div>
        <button
            type="button"
            class="closed-lookup-close"
            aria-label="Close"
        >×</button>
    </div>

    <div class="closed-lookup-date-search">
        <label for="closedFromDate">From</label>
        <label for="closedToDate">To</label>

        <input
            type="date"
            id="closedFromDate"
        >

        <input
            type="date"
            id="closedToDate"
        >

        <button
            type="button"
            class="closed-lookup-search"
            id="closedDateSearch"
        >
            Search
        </button>
    </div>

    <div
        class="closed-lookup-name-search"
        id="closedNameSearchContainer"
        hidden
    >
        <label for="closedNameSelect">
            Parent / Client Name
        </label>

        <select id="closedNameSelect">
            <option value="">
                Select a conversation
            </option>
        </select>
    </div>
`;

document.body.appendChild(menuContainer);

const lookupButton=document.getElementById('lookupClosedButton');
const closeButton=menuContainer.querySelector('.closed-lookup-close');
const fromDate=menuContainer.querySelector('#closedFromDate');
const toDate=menuContainer.querySelector('#closedToDate');
const dateSearchButton=menuContainer.querySelector('#closedDateSearch');
const nameSearchContainer=menuContainer.querySelector('#closedNameSearchContainer');
const nameSelect=menuContainer.querySelector('#closedNameSelect');

const HISTORY_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_get_history';

/* DATE HELPERS */

function formatDateInput(date){
    const year=date.getFullYear();
    const month=String(date.getMonth()+1).padStart(2,'0');
    const day=String(date.getDate()).padStart(2,'0');

    return `${year}-${month}-${day}`;
}

function dateInputToEpoch(value){
    const date=new Date(`${value}T00:00:00`);
    return date.getTime();
}

function setDefaultDates(){
    const today=formatDateInput(new Date());

    fromDate.value=today;
    toDate.value=today;
}

/* MENU VISIBILITY */

function openClosedLookup(){
    setDefaultDates();
    clearNameResults();

    menuContainer.classList.add('is-open');
    menuContainer.setAttribute('aria-hidden','false');
}

function closeClosedLookup(){
    menuContainer.classList.remove('is-open');
    menuContainer.setAttribute('aria-hidden','true');
}

/* CLEAR NAME RESULTS */

function clearNameResults(){
    nameSearchContainer.hidden=true;

    nameSelect.innerHTML=`
        <option value="">
            Select a conversation
        </option>
    `;
}

/* SEARCH CLOSED RECORDS */

async function requestClosedRecords(){
    const from=fromDate.value;
    const to=toDate.value;

    if(!from || !to){
        return;
    }

    const dateFrom=dateInputToEpoch(from);
    const dateTo=dateInputToEpoch(to);

    if(
        Number.isNaN(dateFrom) ||
        Number.isNaN(dateTo)
    ){
        return;
    }

    if(dateFrom>dateTo){
        alert('The From date cannot be after the To date.');
        return;
    }

    clearNameResults();

    dateSearchButton.disabled=true;
    dateSearchButton.textContent='Searching...';

    try{
        const response=await fetch(
            `${HISTORY_API}?date_from=${dateFrom}&date_to=${dateTo}`,
            {
                method:'GET',
                credentials:'include'
            }
        );

        if(!response.ok){
            throw new Error(
                `History request failed: ${response.status}`
            );
        }

        const data=await response.json();

        setClosedLookupResults(
            data.qna_inquiry_history || []
        );
    }
    catch(error){
        console.error(
            'Closed inquiry lookup failed:',
            error
        );

        alert(
            'Unable to load closed inquiries. Please try again.'
        );
    }
    finally{
        dateSearchButton.disabled=false;
        dateSearchButton.textContent='Search';
    }
}

/* POPULATE NAME DROPDOWN */

export function setClosedLookupResults(records){
    clearNameResults();

    if(
        !records ||
        records.length===0
    ){
        nameSelect.innerHTML=`
            <option value="">
                No closed conversations found
            </option>
        `;

        nameSearchContainer.hidden=false;
        return;
    }

    const sortedRecords=[...records].sort(
        (a,b)=>
            String(a.parent_name || '').localeCompare(
                String(b.parent_name || '')
            )
    );

    sortedRecords.forEach(
        record=>{
            const option=document.createElement('option');

            option.value=record.id;

            option.textContent=
                record.parent_name ||
                'Unnamed';

            option.dataset.record=
                JSON.stringify(record);

            nameSelect.appendChild(option);
        }
    );

    nameSearchContainer.hidden=false;
}

/* SELECTED RECORD */

export function getSelectedClosedInquiry(){
    const option=nameSelect.selectedOptions[0];

    if(
        !option ||
        !option.value
    ){
        return null;
    }

    try{
        return JSON.parse(
            option.dataset.record
        );
    }
    catch(error){
        return null;
    }
}

/* EVENTS */

lookupButton.addEventListener(
    'click',
    event=>{
        event.stopPropagation();

        if(
            menuContainer.classList.contains(
                'is-open'
            )
        ){
            closeClosedLookup();
        }
        else{
            openClosedLookup();
        }
    }
);

closeButton.addEventListener(
    'click',
    closeClosedLookup
);

dateSearchButton.addEventListener(
    'click',
    requestClosedRecords
);

menuContainer.addEventListener(
    'click',
    event=>{
        event.stopPropagation();
    }
);

document.addEventListener(
    'click',
    event=>{
        if(
            menuContainer.classList.contains(
                'is-open'
            ) &&
            !menuContainer.contains(event.target) &&
            event.target!==lookupButton
        ){
            closeClosedLookup();
        }
    }
);

/* EXPORT DATE RANGE */

export function getClosedDateRange(){
    return {
        from:fromDate.value,
        to:toDate.value
    };
}

/* EXPORT SELECTED RECORD */

export function getClosedInquirySelect(){
    return nameSelect;
}
