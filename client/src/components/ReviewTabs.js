import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
    Tabs,
    Tab,
    Box,
    Typography,
} from "@mui/material";
import ReactStars from "react-rating-stars-component";

// Helper component cho nội dung tab panel theo MUI docs
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`review-tabpanel-${index}`}
            aria-labelledby={`review-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `review-tab-${index}`,
        'aria-controls': `review-tabpanel-${index}`,
    };
}

const ReviewTabs = ({ reviews }) => {
    const sentimentLabels = ["POS", "NEU", "NEG"];
    const sentimentTitles = ["Tích cực", "Trung tính", "Tiêu cực"];
    const ratingLevels = [5, 4, 3, 2, 1];

    // Tổng list tab: sentiment + rating
    const tabs = [
        ...sentimentLabels.map((label, i) => ({
            type: "sentiment",
            key: label,
            title: sentimentTitles[i],
        })),
        ...ratingLevels.map((star) => ({
            type: "rating",
            key: star.toString(),
            title: `${star} sao`,
        })),
    ];

    // Lọc review theo sentiment
    const reviewsBySentiment = useMemo(() => {
        const map = { POS: [], NEU: [], NEG: [] };
        reviews.forEach((r) => {
            if (map[r.sentiment]) map[r.sentiment].push(r);
        });
        return map;
    }, [reviews]);

    // Lọc review theo rating
    const reviewsByRating = useMemo(() => {
        const map = { 5: [], 4: [], 3: [], 2: [], 1: [] };
        reviews.forEach((r) => {
            if (map[r.rating]) map[r.rating].push(r);
        });
        return map;
    }, [reviews]);

    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Render danh sách review
    const renderReviewList = (reviewList) => {
        if (!reviewList || reviewList.length === 0) {
            return (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                    Không có đánh giá nào
                </Typography>
            );
        }
        return reviewList.map((item) => (
            <Box
                key={item.review_id}
                sx={{ mb: 3, p: 2, borderBottom: "1px solid #eee" }}
                role="region"
                aria-label={`Review của ${item.Customer?.name || "Khách ẩn danh"}`}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography fontWeight="bold">
                            {item.Customer?.name || "Khách ẩn danh"}
                        </Typography>
                        <ReactStars
                            count={5}
                            value={item.rating}
                            size={20}
                            edit={false}
                            isHalf={true}
                            activeColor="#ffd700"
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            fullIcon={<i className="fa fa-star"></i>}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(item.created_at).toLocaleDateString()}
                    </Typography>
                </Box>
                <Typography>{item.content}</Typography>
            </Box>
        ));
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Review tabs"
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                {tabs.map(({ type, key, title }, index) => {
                    const count =
                        type === "sentiment"
                            ? reviewsBySentiment[key]?.length || 0
                            : reviewsByRating[key]?.length || 0;
                    return (
                        <Tab
                            key={key}
                            label={`${title} (${count})`}
                            {...a11yProps(index)}
                            sx={{ textTransform: "none", fontWeight: "bold" }}
                        />
                    );
                })}
            </Tabs>

            {tabs.map(({ type, key }, index) => {
                const list =
                    type === "sentiment"
                        ? reviewsBySentiment[key]
                        : reviewsByRating[key];
                return (
                    <TabPanel key={key} value={tabValue} index={index}>
                        {renderReviewList(list)}
                    </TabPanel>
                );
            })}
        </Box>
    );
};

export default ReviewTabs;