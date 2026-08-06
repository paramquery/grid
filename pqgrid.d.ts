// Type definitions for paramquery Grid v4.0.0
// By: Paramvir Dhindsa
// Project: http://paramquery.com/
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />


interface JQueryStatic{
    active
    paramquery
}

interface JQuery{
    pqGrid(options: pq.gridT.options| string): any
    pqGrid(method: string, param: any): any
}

declare module pq {

    namespace gridT{
        type numberorstring = number|string;
        type colModel= Array<column>;

        interface column{
            /** alignment of content in cells */
            /** "left", "center" or "right" */
            align?: string
            /** properties of a checkbox column */
            cb?: {
                all?: boolean
                check?: boolean | string
                header?: boolean
                select?: boolean
                uncheck?: boolean | string
            }
            /** Class to be assigned to whole column including header. */
            cls?: string
            /** collapse properties for parent grouped columns */
            collapsible?: {
                /**last child of grouped column is visible instead of first column in collapsed state. */
                last?: boolean
                /**true when collapsed, false when expanded */
                on?: boolean
            }
            /** nesting of colModel used for grouping of columns */
            colModel?: colModel
            /** When set to false, this option prevents a column from being copied to the clipboard or exported data */
            copy?: boolean
            /** fieldname used for data binding */
            dataIndx?: string | number
            /** data type of the column "bool" | "date" | "float" | "html" | "integer" | "string" | "stringi" */
            dataType?: string
            /** controls editability of whole column */
            editable?: boolean|((evt, ui: cellObject) => boolean)
            /** editing behaviour for a column and it overrides the global editModel properties. */
            editModel?: {
                keyUpDown?: boolean
                saveKey?: string
                onBlur?: string
                cancelBlurCls?: string
                onTab?: string
            }
            editor?: editorObj | ((ui: cellObject) => editorObj) | boolean
            exportRender?: boolean
            filter?: {
                condition?: string
                value?: any
                value2?: any
                type?: string
                subtype?: string
                init?: (ui:any)=>any
                prepend?: any
                options?: any|Array<any>
                labelIndx?: numberorstring
                valueIndx?: numberorstring
                groupIndx?: numberorstring
                cache?: boolean
                cls?: string
                style?: string
                attr?: string
                listener?: any
                listeners?: Array<any>
            }
            format?: string
            formula?: (ui: {rowData: any}) => any
            groupable?: boolean
            groupChange?: ((val: string) => string)
            halign?: "left" | "center" | "right"
            hidden?: boolean
            maxWidth?: string | number
            minWidth?: string | number
            nodrag?: boolean
            nodrop?: boolean
            parent?: column
            postRender?: (string | ((ui: cellObject) => void ))
            render?: (string | ((ui: renderObj) => string | {
                attr?: string
                cls?: string
                style?: string
                text?: string
            }))
            resizable?: boolean
            sortable?: boolean
            sortType?: ((rowData1: any, rowData2: any, dataIndx: any) => number)
            summary?: {
                edit?: boolean
                /** "avg" | "count" | "min" | "max" | "sum" | "stdev" | "stdevp" */
                type?: string
            }
            title? : string | ((ui:any)=> string)
            type?: string
            validations?: Array<{
                icon?: string
                type: any
                value?: any
                msg?: string
                warn?: boolean
            }>
            width?: number | string
        }
        interface editorObj{
            type?: any
            init?: ((ui:any)=>any)
            prepend?: any
            options?: Array<any>
            labelIndx?: string | number
            valueIndx?: string | number
            groupIndx?: string | number
            dataMap?: Array<any>
            mapIndices?: any
            getData?: ((ui) => any)
            cls?: string
            select?: boolean
            style?: string
            attr?: string
        }
        interface rowObject{
            rowData?: any
            rowIndx?: number
            rowIndxPage?: number
        }
        interface colObject{
            colIndx?: number
            column?: column
            dataIndx?: string | number
        }
        interface cellObject extends rowObject, colObject{
        }
        interface renderObj extends cellObject{
            cellData: any
            Export: boolean
            formatVal: string
        }
        interface pageModel{
            bubble?: boolean
            curPage?: number
            rPPOptions?: Array<number>
            rPP?: number
            strDisplay?: string
            totalPages?: number
            trigger?: boolean
            type?: string
        }
        interface groupModel{
            collapsed?: Array<boolean>
            dataIndx?: Array<string|boolean>
            //dir?: Array<string>
            fixCols?: boolean
            grandSummary?: boolean
            header?: boolean
            headerMenu?: Array<string>
            icon?: Array<string>
            ignoreCase?: boolean
            indent?: number
            menuItems?: Array<string>
            merge?: boolean
            on?: boolean
            showSummary?: Array<boolean>
            summaryEdit?: boolean
            summaryInTitleRow?: string
            title?: Array<any>
            titleDefault?: string
            titleInFirstCol?: boolean
        }
        interface sortModel{
            cancel?: boolean
            ignoreCase?: boolean
            multiKey?: string
            number?: boolean
            on?: boolean
            single?: boolean
            sorter?: Array<any>
            space?: boolean
            type?: string
        }
        interface dataModel{
            beforeSend?: (( jqXHR, settings )=> void)
            contentType?: string
            data?: Object[]
            /** read only. */
            dataUF?: Object[]
            dataType?: string
            error?: (( jqXHR, textStatus, errorThrown )=> void)
            getData?: (response, textStatus, jqXHR) => {
                curPage?: number
                data: Array<any>
                totalRecords?: number
            }
            getUrl?: ((obj: {
                colModel: colModel,
                dataModel: dataModel,
                filterModel,
                groupModel: groupModel,
                pageModel: pageModel,
                sortModel: sortModel
            }) => {
                url: string
                data?: any
            })
            /** "local" | "remote"*/
            location?: string
            method?: string
            postData?: any
            postDataOnce?: any
            recIndx?: numberorstring
            url?: string
        }
        interface options{
            autofill?: boolean
            fillHandle?: string
            bootstrap?: any
            bubble?: boolean
            collapsible?:{
                on?: boolean
                collapsed?: boolean
                toggle?: boolean
                css?: any
            }
            colModel?: colModel
            columnBorders?: boolean
            /**common properties for all leaf columns. */
            columnTemplate?: column
            copyModel?: any
            dataModel? :dataModel
            detailModel?: {
                cache?: true,
                collapseIcon?:"ui-icon-triangle-1-e",
                expandIcon?:"ui-icon-triangle-1-se"
                init: ((ui: rowObject)=> JQuery)
            }
            dragColumns?: {
                enabled?: boolean
                acceptIcon?: string
                rejectIcon?: string
                topIcon?: string
                bottomIcon?: string
            }
            draggable?: boolean
            editable?: boolean| (( ui: rowObject )=>boolean)
            editModel?:{
                //cellBorderWidth?: number
                clicksToEdit?: number
                pressToEdit?: boolean
                filterKeys?: boolean
                keyUpDown?: boolean
                saveKey?: any
                onSave?: 'nextFocus' | 'nextEdit' | '',
                onTab?: 'nextFocus' | 'nextEdit' | '',
                onBlur?: 'validate' | 'save' | '',
                allowInvalid?: boolean
                invalidClass?: string
                warnClass?: string
            }
            editor?: {
                type?: string
                cls?: string
                style?: string
                select?: boolean
            }
            filterModel?: {
                clear?: boolean
                header?: boolean
                mode?: "AND" | "OR",
                on?: boolean,
                type?: 'local' | 'remote'
            }
            flex?: {
                on?: boolean
                one?: boolean
                all?: boolean
            }
            formulas?: [[ number | string, (rowData: any, column: column) => any ]],
            formulasModel?: {
                on?: boolean
            }
            freezeBorders?: number;
            freezeCols?: number,
            freezeRows?: number,
            groupModel?: groupModel
            /** height of grid can be number in pixels e.g., 500, as string e.g., '50%-10', or 'flex'   */
            height?: numberorstring
            hoverMode?: string
            hwrap?: boolean
            maxHeight?: numberorstring
            maxWidth?: numberorstring
            mergeCells?: Array<{
                r1: number
                c1: number
                rc: number
                cc: number
                attr?: string
                cls?: string
                style?: string
            }>
            mergeModel?: {
                /**merged cells are wrapped in div when false */
                flex: boolean
            }
            minWidth?: numberorstring
            numberCell?: {
                width?: number
                title?: string
                resizable?: boolean
                minWidth?: number
                show?: boolean
            }
            pageModel?: pageModel
            pasteModel?: {
                on?: boolean
                select?: boolean
                allowInvalid?: boolean
                /**replace, append or prepend */
                type?: string
            }
            postRenderInterval?: number
            resizable?: boolean
            realFocus?: boolean
            roundCorners?: boolean
            rowBorders?: boolean
            rowHeight?: number
            rowInit?: (ui: rowObject) => void | {
                attr?: string
                style?: string
                cls?: string
            }
            scrollModel?: {
                horizontal?: boolean
                pace?: string
                autoFit?: boolean
                lastColumn?: string
                theme?: boolean
                flexContent?: boolean
            }

            selectionModel?: {
                type?: string,
                mode?: string,
                all?: boolean,
                native?: boolean,
                onTab?: string,
                row?: boolean,
                column?: boolean
                toggle?: boolean
            }
            showBottom?: boolean
            showHeader?: boolean
            showTitle?: boolean
            showToolbar?: boolean
            showTop?: boolean
            sortable?: boolean
            sortModel?: sortModel
            stringify?: boolean
            stripeRows?: boolean
            summaryData?: Array<any>
            summaryOptions?:{
                date?: string
                number?: string
                string?: string
            }
            summaryTitle?: any
            swipeModel?: any
            title?: string
            toolbar?: {
                cls?: string
                items: Array<{
                    type: string
                    options?: Array<any> | any
                    cls?: string
                    style?: string
                    attr?: string
                    label?: string
                    icon?: string
                    listener?: any
                    listeners?: Array<any>
                    value?: any
                }>
            }
            trackModel?: {
                on?: boolean
                dirtyClass?: string
            }
            trigger?: boolean
            validation?:{
                icon?: string
                cls?: string
                style?: string
            }
            treeModel?: Object
            /** true for virtual rendering.*/
            virtualX?: boolean
            /** true for virtual rendering.*/
            virtualY?: boolean
            warning?:{
                icon?: string
                cls?: string
                style?: string
            }
            /** height of grid can be number in pixels e.g., 500, as string e.g., '50%-10', or 'flex'   */
            width?: numberorstring
            wrap?: boolean


            //#################################inline Events------------

            beforeCheck?: (evt, ui) => boolean | void
            beforeColumnCollapse?: (evt, ui) => boolean | void
            beforeExport?: (evt, ui) => boolean | void
            beforeFillHandle?: (evt, ui) => boolean | void
            beforeFilter?: (evt, ui) => boolean | void
            beforeGroupExpand?: (evt, ui) => boolean | void
            beforePaste?: (evt, ui) => boolean | void
            beforeRowExpand?: (evt, ui) => boolean | void
            beforeRowSelect?: (evt, ui) => boolean | void
            beforeSort?: (evt, ui) => boolean | void
            beforeTableView?: (evt, ui) => boolean | void
            beforeValidate?: (evt, ui) => boolean | void
            cellBeforeSave?: (evt, ui) => boolean | void
            cellClick?: (evt, ui) => any
            cellDblClick?: (evt, ui) => any
            cellKeyDown?: (evt, ui) => any
            cellRightClick?: (evt, ui) => any
            cellSave?: (evt, ui) => any
            change?: (evt, ui) => any
            check?: (evt, ui) => any
            columnCollapse?: (evt, ui) => any
            columnDrag?: (evt, ui) => any
            columnOrder?: (evt: Object, ui: Object) => void|boolean
            columnResize?: (evt, ui) => any
            /**event fired when grid data binding and view is complete. */
            complete?: (evt: Object, ui: Object) => void|boolean
            create?: (evt, ui) => any
            dataReady?: (evt, ui) => any
            editorBegin?: (evt, ui) => any
            editorBlur?: (evt, ui) => any
            editorEnd?: (evt, ui) => any
            editorFocus?: (evt, ui) => any
            editorKeyDown?: (evt, ui) => any
            editorKeyPress?: (evt, ui) => any
            editorKeyUp?: (evt, ui) => any
            exportData?: (evt, ui) => any

            //exportExcel?: (evt, ui) => any

            filter?: (evt, ui) => any
            group?: (evt, ui) => any
            groupChange?: (evt, ui) => any
            headerCellClick?: (evt, ui) => any
            history?: (evt, ui:{
                canUndo: boolean
                canRedo: boolean
                type: string
                num_undo: number
                num_redo: number
            }) => any
            load?: ((evt, ui)=> void)
            /**event fired whenever grid is refreshed */
            refresh?: (evt, ui) => void|boolean

            refreshHeader?: (evt, ui) => any
            refreshRow?: (evt, ui: rowObject) => any
            render?: (evt, ui) => any
            rowClick?: (evt, ui: rowObject) => any
            rowDblClick?: (evt, ui: rowObject) => any
            rowRightClick?: (evt, ui: rowObject) => any
            rowSelect?: (evt: Object, ui: any)=> void
            selectChange?: (evt: any, ui: {selection: any}) => any
            selectEnd?: (evt, ui: {selection: any}) => any
            sort?: (evt, ui: {
                dataIndx: numberorstring
                single: boolean
                oldSorter: Array<any>
                sorter: Array<any>
            }) => any
            toggle?: (evt, ui: {state: string}) => any
            workbookReady?: (evt, ui: {workbook: workbook}) => any
        }
        interface objRange{
            r1?: number
            c1?: number
            r2?: number
            c2?: number
            rc?: number
            cc?: number
        }
        interface rangeInstance{
            address(): Array<objRange>
            addressLast(): objRange
            add(obj?: objRange)
            indexOf(obj?: objRange): number
            cut(obj?: {dest?: objRange})
            copy(obj?: {dest?: objRange})
            clear()
            count(): number
            merge()
            select()
            unmerge()
            value(val?: Array<any>): Array<any>
        }
        interface selectionInstance extends rangeInstance{
            getSelection(): [cellObject]
            isSelected(obj: {rowIndx: number, colIndx?: number, dataIndx?: numberorstring}): boolean
            removeAll()
            selectAll(obj?:{all:boolean})
        }

        interface worksheetColumn{
            hidden?: boolean
            width?: number
            /**Zero based index of column*/
            indx?: number
        }
        interface worksheetCell{
            /**horizontal alignment of cell. */
            align?: string
            /**background color with hexadecimal 6 digit format i.e., ff0000 for red */
            bgColor?: string
            bold?: boolean
            /**text color with hexadecimal 6 digit format i.e., ff0000 for red */
            color?: string
            /**dataIndx of cell while export of grid */
            dataIndx?: string | number
            /**Zero based index of cell*/
            indx?: number
            italic?: boolean
            /**font family */
            font?: string
            fontSize?: number
            /**Excel format string for numbers, dates */
            format?: string
            /**formula without leading = sign */
            formula?: string
            underline?: boolean
            valign?: string
            value?: any
            wrap?: boolean
        }
        interface worksheetRow{
            /**Zero based index of row*/
            indx?: number
            cells: [worksheetCell]
            hidden?: boolean
        }
        interface worksheet{
            name?: string
            columns?: [worksheetColumn]
            frozenRows?: number
            frozenCols?: number
            mergeCells?: [string]
            /**number of header rows in rows. */
            headerRows?: number
            rows: [worksheetRow]
        }
        interface workbook{
            sheets?: Array<worksheet>
        }

        interface instance{

            addClass(obj:{
                rowData?: any,
                rowIndx?: number,
                dataIndx?: string | number,
                cls: string,
                refresh?: boolean
            })

            addRow(obj: {
                newRow?: any,
                //rowData?: any,
                rowIndx?: number,
                //rowIndxPage?: number,
                rowList?: Array<any>,
                track?: boolean,
                source?: string,
                history?: boolean,
                checkEditable?: boolean,
                refresh?: boolean
            })

            attr(obj: {
                rowData?: any,
                rowIndx?: number,
                dataIndx: string|number,
                attr: string
            })

            collapse()

            Columns(): {
                alter( callback: () => any)
                each( callback:(column) => any, cm?: colModel)
                find( callback:(column) => boolean, cm?: colModel): column
            }

            commit(obj?:{
                type?: string,
                rows?: Array<any>
            });

            copy()

            createTable(obj: {
                $cont: JQuery,
                data: Array<any>
            })
            data(obj:{
                rowData,
                rowIndx,
                dataIndx,
                data
            })
            deleteRow(obj: {
                rowIndx?: number,
                rowList?: Array<any>,
                track?: boolean,
                source?: string,
                history?: boolean,
                refresh?: boolean
            })

            destroy();

            disable()

            enable()

            editCell(obj: cellObject)

            editFirstCellInRow(obj: { rowIndx: number } )

            expand( )

            exportData(options: {
                /**String of css rules applicable to Html format. */
                cssRules?: string,
                /**Name of file without extension. */
                filename?: string,
                /**csv, xlsx, json or htm  */
                format?: string,
                /**non-json export: exclude header in export. */
                noheader?: boolean,
                /**json export: exclude pq_ related meta data. */
                nopqdata?: boolean,
                /**json export: skip formatting of exported data. */
                nopretty?: boolean,
                /**include rendered cells. */
                render?: boolean,
                /** Excel sheet name. */
                sheetName?: string,
                /**Applicable to htm format. Title of html page. */
                title?: string,
                /**Excel export: maps to type parameter of jsZip generate method.*/
                type?: string
                /**Absolute or relative url where grid posts the data to be returned back by server as a download file. The data is not posted when url is not provided. */
                url?: string,
                /**Excel export: generate intermediate json workbook instead of final Excel file. */
                workbook?: boolean
                /**Applicable to non-xlsx format. Set it true to reduce the size of download file by compressing it. */
                zip?: boolean
            }): string|Blob;

            exportExcel(option?: any)

            filter(obj: {
                /** 'AND' or 'OR' */
                mode?: string
                /** 'add' or 'replace' */
                oper?: string,
                rules?: Array<{ dataIndx: numberorstring, condition?: string, value, value2?: any }>,
                rule?: { dataIndx: numberorstring, condition?: string, value, value2?: any },
                data?: Array<any>
            })

            flex(obj?: {
                dataIndx?: Array<numberorstring>, colIndx?: Array<number>
            })

            focus(obj?: {
                rowIndxPage: number,
                colIndx: number
            })

            getCell(obj: cellObject): JQuery

            getCellHeader(obj: {
                dataIndx?: numberorstring,
                colIndx?: number
            }): JQuery

            getCellsByClass(obj: {
                cls: string
            }): Array<cellObject>

            getCellIndices({
                $td: JQuery
            }): cellObject

            getChanges(obj:{
                /** 'byVal', 'raw' or null. */
                format?: string,
                /** Applicable only when format is 'byVal', it returns all fields in updateList when true. */
                all?: boolean }): {
                    addList: Array<any>
                    deleteList: Array<any>
                    updateList: Array<any>
                }

            getColIndx(obj: {
                dataIndx?: string | number
                column?: any
            }): number

            getColumn(obj: {
                dataIndx?: numberorstring
                colIndx?: number
            }): any

            /** Array of leaf level columns */
            getColModel( ): Array<any>

            /**returns filtered data concatenated with unfiltered data when no params are passed*/
            getData(obj: {
                dataIndx?: Array<numberorstring>
                data?: Array<any>
            }): Array<any>

            getEditCell():{
                $td: JQuery
                $cell: JQuery
                $editor: JQuery
            }

            getEditCellData(): any

            getInstance(): {
                grid: instance
            }

            getRecId(obj: rowObject): any

            getRow(obj: {
                rowIndx?: number
                rowIndxPage?: number
            }): JQuery

            getRowData(obj: {
                rowIndx?: number,
                rowIndxPage?: number,
                recId?: number,
                rowData?: any
            }): any

            getRowIndx(obj: {
                $tr?: JQuery
                rowData?: any
            }): number

            getRowsByClass(obj: { cls: string } ): Array<any>
            /** rowIndx of row ( 0 based ) or page number ( 1 based ) */
            goToPage(obj: { rowIndx?: number, page?: number } )

            Group(params?: any):{
                addGroup(datIndx: numberorstring, indx?: number)
                collapse(level?: number)
                collapseAll(level?: number)
                collapseTo(address: string)
                expand(level?: number)
                expandAll(level?: number)
                expandTo(address: string)
                removeGroup(datIndx: numberorstring)
            }
            groupOption(obj: any)

            hasClass(obj: {
                rowData?: any,
                rowIndx?: number,
                dataIndx?: numberorstring,
                cls: string
            }): boolean

            hideLoading()

            //history(obj: { method: string } )
            History(): {
                canRedo(): boolean
                canUndo(): boolean
                redo()
                reset()
                undo()
            }

            hscrollbar(): any

            /**imports workbook into grid */
            importWb(obj: {
                workbook: workbook,
                /**either specify sheet (name or 0 based index) or the 1st sheet is imported. */
                sheet?: number|string,
                extraRows?: number,
                extraCols?: number,
                keepCM?: boolean,
                /**index of header row. */
                headerRowIndx?: number
            })

            instance(): instance

            isDirty(obj?: {
                rowIndx?: number,
                rowData?: any
            }): boolean

            isEditableCell(obj: {
                rowIndx?: number,
                dataIndx?: numberorstring
            }): boolean

            isEditableRow(obj: { rowIndx: number } ): boolean

            isValid(obj: {
                rowData?: any
                rowIndx?: number,
                dataIndx?: numberorstring,
                value?: any,
                data?: Array<any>,
                allowInvalid?: boolean,
                focusInvalid?: boolean
            }): {
                    valid: boolean,
                    msg: string,
                    cells: [{
                        dataIndx: string | number
                        column: column
                        rowData: any
                    }]
                }

            isValidChange(obj: {
                allowInvalid?: boolean
                focusInvalid?: boolean
            }): {
                    valid: boolean,
                    cells: [{
                        dataIndx: string | number
                        column: column
                        rowData: any
                    }]
                }

            loadState(obj: {
                state?: string,
                refresh?: boolean
            }): boolean

            off( event: string, fn?: ((evt, ui) => any) )

            on( event: string, fn: ((evt, ui) => any) )

            one( event: string, fn: ((evt, ui) => any) )

            option(): any

            option(name: String): any

            option(name: string, value: any);

            option(obj: any)

            pageData(): Array<any>

            pager(): any

            paste()

            quitEditMode()

            Range(obj: objRange): rangeInstance

            /** refresh the grid. */
            refresh(options?: any)

            refreshCell(obj: cellObject)

            refreshCM( colModel?: colModel )

            refreshColumn(obj: cellObject )

            refreshDataAndView()

            refreshHeader()

            refreshRow(obj: rowObject)

            refreshToolbar()

            /** superset of grid refresh.*/
            refreshView();

            removeAttr(obj: {
                rowData?: any,
                rowIndx?: number,
                dataIndx?: numberorstring,
                colIndx?: number
                attr: any
            })

            removeClass(obj: {
                rowData?: any,
                rowIndx?: number,
                dataIndx?: numberorstring,
                colIndx?: number
                cls: string,
                refresh?: boolean
            })

            removeData(obj: {
                rowData?: any,
                rowIndx?: number,
                dataIndx?: numberorstring,
                colIndx?: number
                data: any
            })

            reset(obj: {
                filter?: boolean,
                group?: boolean,
                sort?: boolean
            })

            rollback(obj?: { type?: string })

            rowCollapse(obj: { rowIndx?: number, rowIndxPage?: number } )

            rowExpand(obj: { rowIndx?: number, rowIndxPage?: number } )

            rowInvalidate(obj: { rowIndx?: number, rowIndxPage?: number } )

            saveEditCell(): boolean

            saveState(obj: { save?: boolean} ): string

            scrollColumn(obj: { colIndx?: number, dataIndx?: numberorstring } )

            scrollRow(obj: { rowIndxPage: number } )

            search(obj: { row: any, first?: boolean } ): Array<{
                rowIndx: number
                rowIndxPage: number
            }>

            Selection(): selectionInstance

            SelectRow(): {
                add(obj:{rowIndx?: number, isFirst?: boolean, rows?: [{rowIndx?: number, rowIndxPage?: number}]})
                extend(obj:{rowIndx: number})
                getFirst(): number
                getSelection(): [rowObject]
                isSelected(rowObject: rowObject): boolean
                remove(obj:{rowIndx?: number, rows?: [{rowIndx?: number, rowIndxPage?: number}]})
                removeAll(obj?: {all: boolean})
                selectAll(obj?: {all: boolean})
                setFirst(rowIndx: number)
                toggle(obj:{rowIndx: number, isFirst?: boolean})
                toRange(): rangeInstance
            }

            setSelection(obj: {
                rowIndx?: number,
                rowIndxPage?: number,
                colIndx?: number,
                focus?: boolean
            } )
            showLoading()

            sort(obj?: { single?: boolean, sorter?: Array<any> } )

            toggle()

            toolbar()

            Tree(): {
                addNodes([any], parent?: any)
                checkNodes([any])
                collapseAll()
                collapseNodes([any])
                eachChild(node: any, cb: ((node: any) => void) )
                eachParent(node: any, cb: ((node: any) => void) )
                expandAll()
                expandNodes([any])
                expandTo(node: any)
                getCheckedNodes(): [any]
                getLevel(node: any): number
                getNode(id: number): any
                getParent(node: any): any
                getRoots(): [any]
                isCollapsed(any): boolean
                isFolder(any): boolean
                option(options: any)
                unCheckNodes([any])
            }

            updateRow(obj: {
                rowIndx?: number,
                newRow?: any,
                rowList?: Array<any>,
                track?: boolean,
                source?: string,
                history?: boolean,
                checkEditable?: boolean,
                allowInvalid?: boolean
                refresh?: boolean
            })

            vscrollbar()

            widget(): JQuery
        }

    }

    function escapeHtml(str: string): string

    /** create pqgrid plugin.  */
    function grid(selector: string| JQuery, options: gridT.options): gridT.instance;
    function formatNumber(val: number, format: string): string


    namespace aggregate{
        function avg(arr: [any], col?: any): number
        function count(arr: Array<any>, col?: any): number
        function max(arr: Array<any>, col?: any): number
        function min(arr: Array<any>, col?: any): number
        function sum(arr: Array<any>, col?: any): number
        function stdev(arr: Array<any>, col?: any): number
        function stdevp(arr: Array<any>, col?: any): number
    }
    namespace excel{
        /**exports js workbook to xlsx format. */
        function exportWb(obj: {
            workbook: gridT.workbook,
            url?: string,
            type?: string
        }): string|Blob
        function eachCell(
            collection: Array<gridT.worksheet | gridT.worksheetRow>,
            fn: ((cell: gridT.worksheetCell) => void )
        )
        /**import xlsx into js workbook */
        function importXl(obj: {
                /**File object */
                file?: File,
                /**Blob data of Excel file. */
                content?: any,
                /** specify index numbers or names of sheet to be imported, otherwise all sheets are imported. */
                sheets?: [number|string],
                /** type of content used by jsZip. */
                type?: string,
                /**remote url from where Excel file is to be imported */
                url?: string },
            /**callback function to process the workbook. */
            fn: (wb: gridT.workbook) => void)
        function getArray(ws: gridT.worksheet): Array<any>
        function getCsv(ws: gridT.worksheet): string
    }
    namespace excelImport{
        function attr(str: string): any
    }

}