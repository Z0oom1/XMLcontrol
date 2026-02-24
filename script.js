let currentHandle = null;
let pathHistory = [];
let selectedNames = new Set();
let displayedEntries = [];
let folderMeta = JSON.parse(localStorage.getItem('mm_core_meta')) || {};
let editingEntry = null;

async function connectStorage() {
    try {
        currentHandle = await window.showDirectoryPicker();
        pathHistory = [currentHandle];
        renderUI();
    } catch (e) { console.error("Acesso negado"); }
}

async function renderUI() {
    const canvas = document.getElementById('fileCanvas');
    const search = document.getElementById('smartSearch').value.toLowerCase();
    canvas.innerHTML = '';
    displayedEntries = [];
    document.getElementById('breadcrumbPath').innerHTML = pathHistory.map(h => h.name).join(' / ');

    for await (const entry of currentHandle.values()) {
        if (search && !entry.name.toLowerCase().includes(search)) continue;
        displayedEntries.push(entry);
        
        const meta = folderMeta[entry.name] || {};
        const card = document.createElement('div');
        card.className = `item-card ${selectedNames.has(entry.name) ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="folder-icon" style="background: ${meta.color || ''}">
                ${meta.img ? `<img src="${meta.img}">` : ''}
            </div>
            <span class="item-name">${entry.name}</span>
        `;

        card.onclick = (e) => {
            if (!e.ctrlKey && !e.metaKey) selectedNames.clear();
            selectedNames.toggle(entry.name); // Função auxiliar simulada
            if (!selectedNames.has(entry.name)) selectedNames.add(entry.name); else selectedNames.delete(entry.name);
            updateUI();
            updateInspector(entry);
        };

        card.oncontextmenu = (e) => { e.stopPropagation(); openFolderModal(entry); };

        card.ondblclick = () => {
            if (entry.kind === 'directory') {
                currentHandle = entry;
                pathHistory.push(entry);
                selectedNames.clear();
                renderUI();
            }
        };

        canvas.appendChild(card);
    }
}

function updateUI() {
    document.querySelectorAll('.item-card').forEach(card => {
        const name = card.querySelector('.item-name').innerText;
        card.classList.toggle('selected', selectedNames.has(name));
    });
    document.getElementById('selectionCount').innerText = selectedNames.size;
}

function updateInspector(entry) {
    const meta = folderMeta[entry.name] || {};
    document.getElementById('insName').innerText = entry.name;
    document.getElementById('insMeta').innerText = entry.kind === 'directory' ? 'Pasta de Arquivos' : 'Arquivo';
    document.getElementById('insPreview').style.background = meta.color || '#007aff';
}

// Atalhos e Contexto
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        displayedEntries.forEach(entry => selectedNames.add(entry.name));
        updateUI();
    }
});

window.oncontextmenu = (e) => {
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'block'; menu.style.left = e.pageX + 'px'; menu.style.top = e.pageY + 'px';
};
window.onclick = () => document.getElementById('contextMenu').style.display = 'none';

// Modal Logic
function openFolderModal(entry) {
    editingEntry = entry;
    const modal = document.getElementById('folderModal');
    if(entry) {
        document.getElementById('folderName').value = entry.name;
        document.getElementById('folderColor').value = folderMeta[entry.name]?.color || "#007aff";
    }
    modal.style.display = 'flex';
}

function closeModal() { document.getElementById('folderModal').style.display = 'none'; }

document.getElementById('saveFolderBtn').onclick = async () => {
    const name = document.getElementById('folderName').value;
    folderMeta[name] = { 
        color: document.getElementById('folderColor').value, 
        img: document.getElementById('folderImg').value 
    };
    localStorage.setItem('mm_core_meta', JSON.stringify(folderMeta));
    if(!editingEntry) await currentHandle.getDirectoryHandle(name, {create: true});
    closeModal(); renderUI();
};