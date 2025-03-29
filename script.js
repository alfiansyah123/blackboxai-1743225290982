document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('shorten-button');
    const textarea = document.getElementById('urls');
    const customAliasCheckbox = document.getElementById('use_custom_alias');
    const resultsContainer = document.getElementById('results');

    function generateRandomString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }

    function createUrlElement(originalUrl, shortUrl) {
        const div = document.createElement('div');
        div.className = 'p-2 border-bottom d-flex justify-content-between align-items-center';
        
        const urlsDiv = document.createElement('div');
        urlsDiv.className = 'flex-grow-1 me-3';
        urlsDiv.innerHTML = `
            <div class="text-muted small">${originalUrl}</div>
            <div class="text-primary">${shortUrl}</div>
        `;

        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-sm btn-outline-secondary copy-button';
        copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
        copyButton.onclick = async () => {
            const success = await copyToClipboard(shortUrl);
            if (success) {
                copyButton.innerHTML = '<i class="bi bi-check"></i> Copied!';
                copyButton.classList.replace('btn-outline-secondary', 'btn-success');
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                    copyButton.classList.replace('btn-success', 'btn-outline-secondary');
                }, 2000);
            }
        };

        div.appendChild(urlsDiv);
        div.appendChild(copyButton);
        return div;
    }

    button.addEventListener('click', async function() {
        const urls = textarea.value.trim().split('\n').filter(url => url.trim());
        const useCustomAlias = customAliasCheckbox.checked;

        if (urls.length === 0) {
            resultsContainer.innerHTML = '<div class="text-danger text-center py-3">Masukkan setidaknya satu URL.</div>';
            return;
        }

        // Clear previous results and show loading
        resultsContainer.innerHTML = '<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Memproses URL...</div></div>';
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

        try {
            resultsContainer.innerHTML = ''; // Clear loading indicator
            
            for (const url of urls) {
                if (!url.trim()) continue;

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 300));

                const randomStr = generateRandomString(6);
                const shortUrl = useCustomAlias ? 
                    `https://l.wl.co/${randomStr}` : 
                    `https://clcr.me/${randomStr}`;

                const urlElement = createUrlElement(url.trim(), shortUrl);
                resultsContainer.appendChild(urlElement);
            }

            if (resultsContainer.children.length === 0) {
                resultsContainer.innerHTML = '<div class="text-muted text-center py-3">Tidak ada URL yang valid untuk diproses.</div>';
            }

        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Terjadi kesalahan: ${error.message}
                </div>
            `;
        } finally {
            button.disabled = false;
            button.innerHTML = 'Shorten URLs';
        }
    });

    // Add input validation
    textarea.addEventListener('input', function() {
        const urls = this.value.trim().split('\n').filter(url => url.trim());
        button.disabled = urls.length === 0;
        
        if (urls.length === 0) {
            button.classList.add('opacity-50');
        } else {
            button.classList.remove('opacity-50');
        }
    });

    // Initialize button state
    button.disabled = true;
    button.classList.add('opacity-50');
});