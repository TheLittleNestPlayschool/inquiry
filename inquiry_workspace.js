/* ==========================================
   INQUIRY WORKSPACE
========================================== */

const indicators=[
    'Tuition / Price / Fees',
    'Schedule / Days / Times',
    'Age / Eligibility',
    'Free Trial',
    'Programs / Activities / What\'s Included',
    'Location / Directions / Parking',
    'Requirements / What to Bring',
    'Enrollment / Payment / Attendance',
    'Class Size / Teachers / Ratio',
    'Special Needs / Additional Support',
    'Enrollment Requirements'
];

let workspace=null;
let selectedInquiry=null;


/* ==========================================
   CREATE WORKSPACE
========================================== */

function createWorkspace(){

    if(workspace){
        return;
    }

    workspace=
        document.createElement(
            'div'
        );

    workspace.className=
        'inquiry-workspace';

    workspace.setAttribute(
        'aria-hidden',
        'true'
    );


    workspace.innerHTML=`

        <div
            class="inquiry-workspace-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiryWorkspaceName"
        >


            <!-- HEADER -->

            <header class="inquiry-workspace-header">

                <div class="inquiry-workspace-header-info">

                    <h2
                        id="inquiryWorkspaceName"
                        class="inquiry-workspace-name"
                    >
                        Inquiry
                    </h2>

                    <p class="inquiry-workspace-branch">
                        Branch
                    </p>

                </div>


                <button
                    type="button"
                    class="inquiry-workspace-close"
                    aria-label="Close inquiry"
                >
                    ×
                </button>

            </header>


            <!-- QUESTION INDICATORS -->

            <section
                class="inquiry-workspace-indicators-section"
            >

                <div
                    class="inquiry-workspace-indicators"
                ></div>

            </section>


            <!-- CONVERSATION HISTORY -->

            <section
                class="inquiry-workspace-history-section"
            >

                <div
                    class="inquiry-workspace-history"
                >

                    <div
                        class="inquiry-workspace-history-empty"
                    >
                        No conversation history yet.
                    </div>

                </div>

            </section>


            <!-- MESSAGE BUILDER -->

            <section
                class="inquiry-workspace-builder"
            >

                <label
                    class="inquiry-workspace-builder-label"
                    for="inquiryWorkspaceMessageInput"
                >
                    Paste Parent Message
                </label>


                <div
                    class="inquiry-workspace-message-row"
                >

                    <textarea
                        id="inquiryWorkspaceMessageInput"
                        class="inquiry-workspace-message-input"
                        rows="2"
                        maxlength="500"
                        placeholder="Paste the parent's message here..."
                    ></textarea>


                    <button
                        type="button"
                        class="inquiry-workspace-classify"
                    >
                        Find Response
                    </button>

                </div>


                <!-- SUGGESTIONS -->

                <div
                    class="inquiry-workspace-suggestions"
                >

                    <div
                        class="inquiry-workspace-suggestions-title"
                    >
                        Suggestions
                    </div>

                    <div
                        class="inquiry-workspace-suggestions-content"
                    ></div>

                </div>

            </section>


        </div>

    `;


    document.body.appendChild(
        workspace
    );


    /* ======================================
       CLOSE
    ====================================== */

    workspace
        .querySelector(
            '.inquiry-workspace-close'
        )
        .addEventListener(
            'click',
            closeInquiryWorkspace
        );


    workspace.addEventListener(
        'click',
        event=>{

            if(
                event.target===
                workspace
            ){

                closeInquiryWorkspace();

            }

        }
    );


    /* ======================================
       FIND RESPONSE
    ====================================== */

    workspace
        .querySelector(
            '.inquiry-workspace-classify'
        )
        .addEventListener(
            'click',
            handleFindResponse
        );


    renderIndicators();

}


/* ==========================================
   RENDER INDICATORS
========================================== */

function renderIndicators(){

    const container=
        workspace.querySelector(
            '.inquiry-workspace-indicators'
        );

    container.innerHTML='';


    indicators.forEach(
        indicator=>{

            const element=
                document.createElement(
                    'div'
                );

            element.className=
                'inquiry-workspace-indicator';


            const status=
                document.createElement(
                    'span'
                );

            status.className=
                'inquiry-workspace-indicator-status';


            const label=
                document.createElement(
                    'span'
                );

            label.className=
                'inquiry-workspace-indicator-label';

            label.textContent=
                indicator;


            element.dataset.indicator=
                indicator;


            element.appendChild(
                status
            );

            element.appendChild(
                label
            );


            container.appendChild(
                element
            );

        }
    );

}


/* ==========================================
   OPEN WORKSPACE
========================================== */

export function openInquiryWorkspace(
    inquiry
){

    createWorkspace();


    selectedInquiry=
        inquiry || null;


    const name=
        workspace.querySelector(
            '.inquiry-workspace-name'
        );


    const branch=
        workspace.querySelector(
            '.inquiry-workspace-branch'
        );


    name.textContent=
        inquiry?.parent_name ||
        'Inquiry';


    branch.textContent=
        inquiry?.franchise_name ||
        'Branch';


    workspace.classList.add(
        'is-open'
    );


    workspace.setAttribute(
        'aria-hidden',
        'false'
    );


    const input=
        workspace.querySelector(
            '.inquiry-workspace-message-input'
        );


    input.value='';

    input.focus();

}


/* ==========================================
   CLOSE WORKSPACE
========================================== */

export function closeInquiryWorkspace(){

    if(!workspace){
        return;
    }


    workspace.classList.remove(
        'is-open'
    );


    workspace.setAttribute(
        'aria-hidden',
        'true'
    );


    selectedInquiry=null;

}


/* ==========================================
   FIND RESPONSE
========================================== */

function handleFindResponse(){

    const input=
        workspace.querySelector(
            '.inquiry-workspace-message-input'
        );


    const message=
        input.value.trim();


    if(!message){

        input.focus();

        return;

    }


    console.log(
        'Find response:',
        message,
        selectedInquiry
    );

}


/* ==========================================
   ESCAPE
========================================== */

document.addEventListener(
    'keydown',
    event=>{

        if(
            event.key==='Escape' &&
            workspace &&
            workspace.classList.contains(
                'is-open'
            )
        ){

            closeInquiryWorkspace();

        }

    }
);
