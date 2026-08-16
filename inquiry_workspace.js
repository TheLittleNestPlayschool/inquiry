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

/* CREATE WORKSPACE */

function createWorkspace(){
    if(workspace){
        return;
    }

    workspace=document.createElement('div');
    workspace.className='inquiry-workspace';
    workspace.setAttribute('aria-hidden','true');

    workspace.innerHTML=`
        <div
            class="inquiry-workspace-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiryWorkspaceName"
        >
            <header class="inquiry-workspace-header">

                <div class="inquiry-workspace-header-info">

                    <h2
                        id="inquiryWorkspaceName"
                        class="inquiry-workspace-name"
                    >
                        Inquiry
                    </h2>

                    <p class="inquiry-workspace-branch"></p>

                </div>

                <button
                    type="button"
                    class="inquiry-workspace-close"
                    aria-label="Close inquiry"
                >
                    ×
                </button>

            </header>

            <div class="inquiry-workspace-indicators"></div>

            <div class="inquiry-workspace-history">

                <div class="inquiry-workspace-history-empty">
                    No conversation history yet.
                </div>

            </div>

            <div class="inquiry-workspace-builder">

                <label
                    class="inquiry-workspace-builder-label"
                    for="inquiryWorkspaceMessageInput"
                >
                    Paste Parent Message
                </label>

                <textarea
                    id="inquiryWorkspaceMessageInput"
                    class="inquiry-workspace-message-input"
                    placeholder="Paste the parent's message here..."
                ></textarea>

                <div class="inquiry-workspace-builder-actions">

                    <button
                        type="button"
                        class="inquiry-workspace-classify"
                    >
                        Classify Message
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(
        workspace
    );

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
                event.target===workspace
            ){
                closeInquiryWorkspace();
            }
        }
    );

    workspace
        .querySelector(
            '.inquiry-workspace-classify'
        )
        .addEventListener(
            'click',
            handleClassify
        );

    renderIndicators();
}

/* RENDER INDICATORS */

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

            element.dataset.indicator=
                indicator;

            element.textContent=
                indicator;

            container.appendChild(
                element
            );

        }
    );

}

/* OPEN */

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

/* CLOSE */

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

/* CLASSIFY PLACEHOLDER */

function handleClassify(){

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
        'Message ready for classification:',
        message,
        selectedInquiry
    );

}

/* ESCAPE */

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
