    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '委托单位',
                title: '委托单位',
                align: 'center'
            }, {
                field: '评审人员',
                title: '评审人员',
                align: 'center'
            }, {
                field: '委托方的要求是否明确',
                title: '委托方的要求...',
                titleTooltip:'委托方的要求是否明确',
                align: 'center'
            }, {
                field: '实验室技术能力和资源是否满足委托方的要求',
                title: '能力和资源...',
                titleTooltip:'实验室技术能力和资源是否满足委托方的要求',
                align: 'center'
            }, {
                field: '选择的测试方法是否能达到委托方的测试要求',
                title: '测试方法...',
                titleTooltip:'选择的测试方法是否能达到委托方的测试要求',
                align: 'center'
            }, {
                field: '服务时间是否合理',
                title: '服务时间...',
                titleTooltip:'服务时间是否合理',
                align: 'center'
            }, {
                field: '服务价格是否合理',
                title: '服务价格...',
                titleTooltip:'服务价格是否合理',
                align: 'center'
            }, {
                field: '总分',
                title: '总分',
                align: 'center'
            }, {
                field: '评审结果',
                title: '评审结果',
                align: 'center'
            }]
        });
    });