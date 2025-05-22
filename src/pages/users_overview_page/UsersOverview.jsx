import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import './UsersOverview.css';

const UsersOverview = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [filterOption, setFilterOption] = useState('Total');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProjectData, setUserProjectData] = useState([]);

  useEffect(() => {
    if (submitted) fetchData();
  }, [submitted]);

  const fetchData = async () => {
    if (!(startDate instanceof Date) || isNaN(startDate) ||
      !(endDate instanceof Date) || isNaN(endDate) ||
      !filterOption) {
      console.warn("Invalid or missing date/filter input");
      return;
    }

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    console.log('Sending API request with:', { startdate: start, enddate: end, filter: filterOption });

    try {
      const res = await axios.get('http://localhost:5000/users-overview', {
        params: {
          startdate: start,
          enddate: end,
          filter: filterOption
        }
      });

      const filtered = res.data.filter(d => d.alias !== 'ADMINISTRATOR' && d.name !== 'Out of Office');
      const transformed = filtered.map(d => ({
        ...d,
        duration: Math.floor(d.duration / 3600),
        cost: parseFloat(d.value) * Math.floor(d.duration / 3600)
      }));
      setData(transformed);
      setFilteredData(transformed);
      setUserOptions([...new Set(transformed.map(d => d.alias))].map(name => ({ label: name, value: name })));
    } catch (err) {
      console.error('Failed to load user overview data', err);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    const userData = data.filter(d => d.alias === user);
    setUserProjectData(userData);
  };

  const pieData = () => {
  const userProjectMap = {};
  filteredData.forEach(row => {
    if (!userProjectMap[row.alias]) userProjectMap[row.alias] = new Set();
    userProjectMap[row.alias].add(row.name);
  });

  const labels = Object.keys(userProjectMap);
  const dataCounts = labels.map(label => userProjectMap[label].size);
  const projectLists = labels.map(label => Array.from(userProjectMap[label]));

  return {
    labels,
    datasets: [{
      data: dataCounts,
      backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#26C6DA", "#7E57C2"],
      projectLists
    }]
  };
};

  const summaryByUser = () => {
    const groups = {};
    filteredData.forEach(row => {
      if (!groups[row.alias]) groups[row.alias] = 0;
      groups[row.alias] += row.duration;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  };

  const summaryBarData = () => {
    const sorted = summaryByUser();
    return {
      labels: sorted.map(d => d[0]),
      datasets: [{
        label: 'Total Hours',
        data: sorted.map(d => d[1]),
        backgroundColor: '#48bb78'
      }]
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="card">
        <h2>User Overview Filters</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} showIcon className="w-full md:w-56" />
          <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} showIcon className="w-full md:w-56" />
          <Dropdown value={filterOption} onChange={(e) => setFilterOption(e.value)} options={['Active', 'Inactive', 'Total']} placeholder="Select Filter" className="w-full md:w-40" />
          <Button label="Apply Filters" onClick={() => setSubmitted(true)} className="p-button-success" />
        </div>
      </div>

      {submitted && (
        <>
          <div className="card">
            <h3>Project Count Per User</h3>
            <Chart
 type="pie"
  data={pieData()}
  options={{
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const label = tooltipItem.chart.data.labels[index];
            const projects = tooltipItem.chart.data.datasets[0].projectLists[index];
            const projectLines = projects || [];
            return [
              `${label}:`,
              ...projectLines,
              `Total Projects: ${projectLines.length}`
            ];
          }
        }
      }
    }
  }}
  style={{ maxWidth: '700px', height: '500px' }}
/>
          </div>

          <div className="card">
            <h3>Total Working Hours per User</h3>
            <Chart type="bar" data={summaryBarData()} options={{ indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Hours' } }, y: { title: { display: true, text: 'User' } } } }} />
          </div>

          <div className="card">
            <h3>Select a User</h3>
            <Dropdown value={selectedUser} onChange={(e) => handleUserSelect(e.value)} options={userOptions} placeholder="Select User" className="w-full md:w-64" filter />

            {selectedUser && userProjectData.length > 0 && (
              <>
                <h4 className="mt-4 font-semibold">Total Duration: {userProjectData.reduce((sum, d) => sum + d.duration, 0)} Hours</h4>
                <DataTable value={userProjectData} paginator rows={5} stripedRows responsiveLayout="scroll">
                  <Column field="name" header="Project" />
                  <Column field="duration" header="Duration (h)" />
                  <Column field="value" header="Hourly Rate" />
                  <Column field="cost" header="Total Cost (€)" />
                </DataTable>

                <Chart type="pie" data={{
                  labels: userProjectData.map(d => d.name),
                  datasets: [{
                    data: userProjectData.map(d => d.duration),
                    backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#EC407A", "#AB47BC"]
                  }]
                }} options={{ plugins: { legend: { position: 'bottom' } } }} style={{ maxWidth: '600px', height: '500px' }}/>

                <Chart type="bar" data={{
                  labels: userProjectData.map(d => d.name),
                  datasets: [{
                    label: 'Cost (€)',
                    data: userProjectData.map(d => d.cost),
                    backgroundColor: '#805ad5'
                  }]
                }} options={{ plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Project' } }, y: { title: { display: true, text: 'Cost (€)' } } } }} style={{ maxWidth: '800px', height: '600px' }} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UsersOverview;
