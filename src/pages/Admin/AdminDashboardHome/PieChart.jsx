import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { VscLoading } from "react-icons/vsc";
import axios from "../../../util/axios";
import Notices2 from "./Notices2";
import "./PieChart.css";

const PieChartComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [mobileScreen, setMobileScreen] = useState();
  const [showActiveCategory, setShowActiveCategory] = useState(false);
  const [activeCategoryPie, setActiveCategoryPie] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/orders/pie-chart")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          let newData = response.data.data.map((item) => ({
            name: item._id,
            value: item.saledCount,
            categoryName: item.category_docs.name,
          }));
          setData(newData);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  useEffect(() => {
    if (window.innerWidth < 300) {
      setMobileScreen(window.innerWidth);
    } else if (window.innerWidth < 450) {
      setMobileScreen(window.innerWidth);
    }
  }, []);

  const COLORS = [
    "#6a0093",
    "#209c5e",
    "#2c6df0",
    "#d0d52e",
    "#d83fb9",
    "#be6a27",
    "#cc0000",
    "#28c0c7",
    "#24b64d",
    "#22a42e",
    "#ffd200",
    "#691d15",
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "12px" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const piePiceHoverHandler = (index) => {
    if (data.length > 0) {
      setActiveCategoryPie(data[index].categoryName);
      setShowActiveCategory(true);
    }
  };

  return (
    <div className="pie_chart_wrapper">
      <Notices2 />
      <div className="pie_chart">
        {showActiveCategory && (
          <span className="active_category_pie">
            {activeCategoryPie.length > 0 && activeCategoryPie}
          </span>
        )}
        <h6 className="pie_header_txt">میزان فروش از هر دسته بندی</h6>
        {loading ? (
          <VscLoading className="loader" />
        ) : errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          data.length > 0 && (
            <PieChart
              width={mobileScreen < 300 ? 300 : mobileScreen < 450 ? 330 : 400}
              height={mobileScreen < 300 ? 300 : mobileScreen < 450 ? 330 : 400}
              className="pie"
            >
              <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    onMouseEnter={() => piePiceHoverHandler(index)}
                  />
                ))}
              </Pie>
            </PieChart>
          )
        )}
      </div>
    </div>
  );
};

export default PieChartComponent;
