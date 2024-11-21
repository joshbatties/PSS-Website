async function fetchTrackingInfo(queryType, queryValue) {
    const baseUrl = 'https://fetch-pss-cargo-tracking-data.vercel.app/api/tracking'; 
    const url = `${baseUrl}?${queryType}=${encodeURIComponent(queryValue)}`;

    try {
        // Display loading spinner
        showLoadingIndicator(queryType);

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
        hideLoadingIndicator(queryType);

        // Handle errors returned by the backend
        if (data.error) {
            displayErrorMessage(queryType, data.error);
            return;
        }

        // Display the data in the appropriate section
        if (queryType === 'trackingNumber') {
            displayTrackingResult(data.data);
        } else if (queryType === 'customerCode') {
            displayCustomerSummary(data.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingIndicator(queryType);
        displayErrorMessage(queryType, 'An error occurred while fetching the tracking information. Please try again.');
    }
}

function showLoadingIndicator(type) {
    document.getElementById(`${type}LoadingIndicator`).style.display = 'block';
}

function hideLoadingIndicator(type) {
    document.getElementById(`${type}LoadingIndicator`).style.display = 'none';
}

function displayErrorMessage(type, message) {
    const resultElement = document.getElementById(`${type}Result`);
    resultElement.innerHTML = `<p class="error-message">${message}</p>`;
}

function displayTrackingResult(rows) {
    const trackingResultElement = document.getElementById('trackingResult');
    if (rows.length === 0) {
        trackingResultElement.innerHTML = '<p>No matching shipments found.</p>';
        return;
    }

    let html = `
        <h2>Tracking Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Vessel Name</th>
                    <th>Voyage Number</th>
                    <th>Date/Time</th>
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
    trackingResultElement.innerHTML = html;
}

function displayCustomerSummary(rows) {
    const customerSummaryElement = document.getElementById('customerSummary');
    if (rows.length === 0) {
        customerSummaryElement.innerHTML = '<p>No shipments found for this customer code.</p>';
        return;
    }

    let html = `
        <h2>Customer Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Vessel Name</th>
                    <th>Voyage Number</th>
                    <th>Date/Time</th>
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
    customerSummaryElement.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('trackShipmentBtn').addEventListener('click', function () {
        const trackingNumber = document.getElementById('trackingNumber').value.trim();
        if (!trackingNumber) {
            displayErrorMessage('trackingNumber', 'Please enter a tracking number.');
            return;
        }
        fetchTrackingInfo('trackingNumber', trackingNumber);
    });

    document.getElementById('searchCustomerBtn').addEventListener('click', function () {
        const customerCode = document.getElementById('customerCode').value.trim();
        if (!customerCode) {
            displayErrorMessage('customerCode', 'Please enter a customer code.');
            return;
        }
        fetchTrackingInfo('customerCode', customerCode);
    });
});
