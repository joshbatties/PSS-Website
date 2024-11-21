async function fetchTrackingInfo(searchValue) {
    const baseUrl = 'https://fetch-pss-cargo-tracking-data.vercel.app/api/tracking';
    const url = `${baseUrl}?query=${encodeURIComponent(searchValue)}`;

    try {
        // Show loading spinner
        showLoadingIndicator();

        // Fetch data from the Vercel backend
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();

        // Hide the loading spinner
        hideLoadingIndicator();

        // Handle errors returned by the backend
        if (data.error) {
            displayErrorMessage(data.error);
            return;
        }

        // Display the results
        displayResults(data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingIndicator();
        displayErrorMessage('An error occurred while fetching tracking information. Please try again.');
    }
}

function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

function displayErrorMessage(message) {
    const resultElement = document.getElementById('results');
    resultElement.innerHTML = `<p class="error-message">${message}</p>`;
}

function displayResults(rows) {
    const resultElement = document.getElementById('results');

    if (rows.length === 0) {
        resultElement.innerHTML = '<p>No matching data found.</p>';
        return;
    }

    let html = `
        <h2>Search Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Vessel Name / Voyage Number</th>
                    <th>Date / Time</th>
                    <th>Position</th>
                    <th>ETA</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.forEach(row => {
        html += `
            <tr>
                <td>${row['VESSEL NAME / VOY NO:'] || 'N/A'}</td>
                <td>${row['Date / time:'] || 'N/A'}</td>
                <td>${row['Position:'] || 'N/A'}</td>
                <td>${row['ETA'] || 'N/A'}</td>
                <td>${row['Remarks:'] || 'N/A'}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    resultElement.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchBtn').addEventListener('click', function () {
        const searchValue = document.getElementById('searchInput').value.trim();
        if (!searchValue) {
            displayErrorMessage('Please enter a vessel name or voyage number.');
            return;
        }
        fetchTrackingInfo(searchValue);
    });
});
