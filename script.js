document.addEventListener('DOMContentLoaded', () => {
    const semesterSelect = document.getElementById('semester-select');

    const getData = async () => {
        try {
            const response = await fetch('curriculam.json');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    getData();
});
