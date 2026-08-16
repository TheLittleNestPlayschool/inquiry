/* Closed inquiry lookup menu*/

const menuContainer = document.createElement('div');
menuContainer.className = 'closed-lookup-menu';
menuContainer.setAttribute('aria-hidden', 'true');

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

    <div class="closed-lookup-options">
        <button
            type="button"
            class="closed-lookup-mode is-active"
            data-mode="date"
        >
            By Date
        </button>

        <button
            type="button"
            class="closed-lookup-mode"
            data-mode="name"
        >
            By Name
        </button>
    </div>

    <div class="closed-lookup-date-search">
        <label for="closedFromDate">From</label>
        <input
            type="date"
            id="closedFromDate"
        >

        <label for="closedToDate">To</label>
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
        hidden
    >
        <label for="closedNameSearch">Parent / Client Name</label>

        <div class="closed-lookup-name-row">
            <input
                type="text"
                id="closedNameSearch"
                placeholder="Enter a name"
                autocomplete="off"
            >

            <button
                type="button"
                class="closed-lookup-search"
                id="closedNameSearchButton"
            >
                Search
            </button>
        </div>
    </div>

    <div
        class="closed-lookup-results"
        id="closedLookupResults"
    >
        <div class="closed-lookup-empty">
            Select a date or search for a name.
        </div>
    </div>
`;

document.body.appendChild(menuContainer);

const lookupButton =
    document.getElementById('lookupClosedButton');

const closeButton =
    menuContainer.querySelector(
        '.closed-lookup-close'
    );

const modeButtons =
    menuContainer.querySelectorAll(
        '.closed-lookup-mode'
    );

const dateSearch =
    menuContainer.querySelector(
        '.closed-lookup-date-search'
    );

const nameSearch =
    menuContainer.querySelector(
        '.closed-lookup-name-search'
    );

const fromDate =
    menuContainer.querySelector(
        '#closedFromDate'
    );

const toDate =
    menuContainer.querySelector(
        '#closedToDate'
    );

const nameInput =
    menuContainer.querySelector(
        '#closedNameSearch'
    );

/* Date helpers*/

function formatDateInput(
    date
){
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            '0'
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            '0'
        );

    return `${year}-${month}-${day}`;
}

function setDefaultDates(){
    const today =
        new Date();

    const yesterday =
        new Date();

    yesterday.setDate(
        today.getDate() - 1
    );

    fromDate.value =
        formatDateInput(
            yesterday
        );

    toDate.value =
        formatDateInput(
            today
        );
}

/* Menu visibility*/

function openClosedLookup(){
    menuContainer.classList.add(
        'is-open'
    );

    menuContainer.setAttribute(
        'aria-hidden',
        'false'
    );

    setDefaultDates();
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

/* Search mode*/

function setSearchMode(
    mode
){
    modeButtons.forEach(
        button => {
            button.classList.toggle(
                'is-active',
                button.dataset.mode === mode
            );
        }
    );

    const isDate =
        mode === 'date';

    dateSearch.hidden =
        !isDate;

    nameSearch.hidden =
        isDate;

    if(!isDate){
        nameInput.focus();
    }
}

modeButtons.forEach(
    button => {
        button.addEventListener(
            'click',
            () => {
                setSearchMode(
                    button.dataset.mode
                );
            }
        );
    }
);

/* Events*/

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

/* Export search controls for API wiring*/

export function getClosedDateRange(){
    return {
        from:
            fromDate.value,

        to:
            toDate.value
    };
}

export function getClosedName(){
    return nameInput.value.trim();
}

export function setClosedLookupResults(
    results
){
    const container =
        menuContainer.querySelector(
            '#closedLookupResults'
        );

    container.innerHTML =
        results || `
            <div class="closed-lookup-empty">
                No closed conversations found.
            </div>
        `;
}
