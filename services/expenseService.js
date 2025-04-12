const { Op, literal, fn, col } = require('sequelize');

const getFilterOptions = (filter, startDate, endDate) => {
    const options = {};
    const now = new Date();
    let start;
    let end;

    switch (filter) {
        case 'week':
            // Get start of the current week (assuming Sunday is the first day)
            start = new Date(now.setDate(now.getDate() - now.getDay()));
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            break;
        case 'month':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case '3months':
            // Current month + previous 2 months
            start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        default:
            // Handle custom date range
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
                // Basic validation: ensure start is before end
                if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
                    throw new Error('Invalid custom date range provided.');
                }
            } else if (startDate || endDate) {
                 throw new Error('Both startDate and endDate are required for custom range.');
            }
            // If no filter and no custom range, don't apply date filter
            break;
    }

    if (start && end) {
        // Ensure dates are inclusive by setting time to start/end of day
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        options.date = {
            [Op.between]: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]] // Use YYYY-MM-DD format for DATEONLY
        };
    }

    return options;
};


module.exports = {
    getFilterOptions,
};
