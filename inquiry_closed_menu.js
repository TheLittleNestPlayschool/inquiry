/* CLOSED INQUIRY LOOKUP MENU */

const menuContainer = document.createElement('div');
menuContainer.className = 'closed-lookup-menu';
menuContainer.setAttribute('aria-hidden','true');

menuContainer.innerHTML = `
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

        <select
            id="closedNameSelect"
        >
            <option value="">
                Select a conversation
            </option>
        </select>
    </div>
`;

document.body.appendChild(menuContainer);

const lookupButton =
    document.getElementById(
        'lookupClosedButton'
    );

const closeButton =
    menuContainer.querySelector(
        '.closed-lookup-close'
    );

const fromDate =
    menuContainer.querySelector(
        '#closedFromDate'
    );

const toDate =
    menuContainer.querySelector(
        '#closedToDate'
    );

const dateSearchButton =
    menuContainer.querySelector(
        '#closedDateSearch'
    );

const nameSearchContainer =
    menuContainer.querySelector(
        '#closedNameSearchContainer'
    );

const nameSelect =
    menuContainer.querySelector(
        '#closedNameSelect'
    );

/* DATE HELPERS */

function formatDateInput(date){
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2,'0');

    const day =
        String(
            date.getDate()
        ).padStart(2,'0');

    return `${year}-${month}-${day}`;
}

function setDefaultDates(){
    const today =
        new Date();

    const todayValue =
        formatDateInput(
            today
        );

    fromDate.value =
        todayValue;

    toDate.value =
        todayValue;
}

/* MENU VISIBILITY */

function openClosedLookup(){
    setDefaultDates();

    clearNameResults();

    menuContainer.classList.add(
        'is-open'
    );

    menuContainer.setAttribute(
        'aria-hidden',
        'false'
    );
}

function closeClosedLookup(){
    menuContainer.classList.remove(
        'is-open'
    );

    menuContainer.setAttribute(
        'aria-hidden',
        'true'
    );
}

/* CLEAR NAME RESULTS */

function clearNameResults(){
    nameSearchContainer.hidden =
        true;

    nameSelect.innerHTML = `
        <option value="">
            Select a conversation
        </option>
    `;
}

/* SEARCH CLOSED RECORDS */

function requestClosedRecords(){
    const from =
        fromDate.value;

    const to =
        toDate.value;

    if(!from || !to){
        return;
    }

    clearNameResults();

    document.dispatchEvent(
        new CustomEvent(
            'closedInquiryDateSearch',
            {
                detail:{
                    from,
                    to
                }
            }
        )
    );
}

/* POPULATE NAME DROPDOWN */

export function setClosedLookupResults(
    records
){
    clearNameResults();

    if(
        !records ||
        records.length === 0
    ){
        return;
    }

    const sortedRecords =
        [...records].sort(
            (a,b) =>
                String(
                    a.parent_name || ''
                ).localeCompare(
                    String(
                        b.parent_name || ''
                    )
                )
        );

    sortedRecords.forEach(
        record => {
            const option =
                document.createElement(
                    'option'
                );

            option.value =
                record.id;

            option.textContent =
                record.parent_name ||
                'Unnamed';

            option.dataset.record =
                JSON.stringify(
                    record
                );

            nameSelect.appendChild(
                option
            );
        }
    );

    nameSearchContainer.hidden =
        false;
}

/* SELECTED RECORD */

export function getSelectedClosedInquiry(){
    const option =
        nameSelect.selectedOptions[0];

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
    event => {
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
    event => {
        event.stopPropagation();
    }
);

document.addEventListener(
    'click',
    event => {
        if(
            menuContainer.classList.contains(
                'is-open'
            ) &&
            !menuContainer.contains(
                event.target
            ) &&
            event.target !== lookupButton
        ){
            closeClosedLookup();
        }
    }
);

/* EXPORT DATE RANGE */

export function getClosedDateRange(){
    return {
        from:
            fromDate.value,

        to:
            toDate.value
    };
}

/* EXPORT SELECTED RECORD */

export function getClosedInquirySelect(){
    return nameSelect;
}
