package com.projectmanagement.dto.response.common;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> content;
    private int page;
    private int totalPages;
    private long totalElements;
    private int size;
    private boolean first;
    private boolean last;
}
