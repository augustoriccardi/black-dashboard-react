import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const Chart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskResponse = await axios.get(`http://localhost:3000/tasks`);
        const tasks = taskResponse.data;

        const taskHrResponse = await axios.get(
          `http://localhost:3000/admin/task-hr-reports`
        );
        const taskHrReports = taskHrResponse.data;

        const taskProgressResponse = await axios.get(
          `http://localhost:3000/admin/task-progress-reports`
        );
        const taskProgressReports = taskProgressResponse.data;

        const datasets = [];
        const colorPalette = [
          "#1f8ef1",
          "#ff6347",
          "#32cd32",
          "#ff8c00",
          "#9932cc",
          // Agrega más colores si es necesario
        ];

        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          const taskHrReportsForTask = taskHrReports.filter(
            (report) => report.task === task._id
          );

          const taskProgressReportsForTask = taskProgressReports.filter(
            (report) => report.task === task._id
          );

          const performanceByMonth = {};

          for (const hrReport of taskHrReportsForTask) {
            const month = new Date(hrReport.date).getMonth();
            if (!performanceByMonth[month]) {
              performanceByMonth[month] = {
                totalHours: 0,
                totalProgress: 0,
              };
            }
            performanceByMonth[month].totalHours += hrReport.hours;
          }

          for (const progressReport of taskProgressReportsForTask) {
            const month = new Date(progressReport.date).getMonth();
            if (!performanceByMonth[month]) {
              performanceByMonth[month] = {
                totalHours: 0,
                totalProgress: 0,
              };
            }
            performanceByMonth[month].totalProgress +=
              progressReport.progressQty;
          }

          const dataset = {
            label: task.title,
            fill: true,
            backgroundColor: "rgba(29,140,248,0.2)",
            borderColor: colorPalette[i % colorPalette.length], // Selecciona un color de la paleta
            borderWidth: 2,
            pointBackgroundColor: colorPalette[i % colorPalette.length], // Selecciona un color de la paleta
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#1f8ef1",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [],
            annotation: {
              drawTime: "afterDatasetsDraw",
              type: "line",
              scaleID: "y",
              value: 1,
              borderColor: "red",
              borderWidth: 1,
              borderDash: [2, 2],
            },
          };

          for (let month = 0; month < 12; month++) {
            const monthData = performanceByMonth[month] || {
              totalHours: 0,
              totalProgress: 0,
            };
            const accumulatedPerformance =
              monthData.totalHours / monthData.totalProgress;
            const budgetedPerformance = task.budgetPerfRatio;
            dataset.data.push(accumulatedPerformance / budgetedPerformance);
          }
          // Verificar si la tarea tiene avance en algún mes
          let hasProgress = false;
          for (const key in dataset.data) {
            if (dataset.data[key] > 0) {
              hasProgress = true;
              break;
            }
          }
          if (hasProgress) {
            datasets.push(dataset);
          }
        }

        setChartData({
          labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    maintainAspectRatio: false,
  };

  return (
    <div>
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default Chart;
